import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { glob, mkdtempDisposable, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { format as formatSourceText } from 'prettier';
import { parse as parseSvelteComponent } from 'svelte/compiler';
import ts from 'typescript';
import { runSveltePackage } from './util/run-svelte-package.ts';

export interface GenerateCustomElementsDtsOptions {
  readonly root: string;
  readonly srcDir: string;
}

export async function generateCustomElementsDts({
  root,
  srcDir,
}: GenerateCustomElementsDtsOptions): Promise<string> {
  await using tmpDist = await mkdtempDisposable(path.join(tmpdir(), 'svelte'));

  if (!path.isAbsolute(srcDir)) {
    srcDir = path.resolve(root, srcDir);
  }
  try {
    const dtsFiles = await getComponentDtsFiles({
      outputTo: tmpDist.path,
      root,
      srcDir,
    });
    const printer = ts.createPrinter();
    let customElementDecls = '';
    let propsDecls = '';
    let importDecls = '';

    for (const dtsFileName of dtsFiles) {
      const result = await getCustomElementProps(dtsFileName, printer);

      if (result) {
        const [props, element, imports] = result;
        customElementDecls += element;
        propsDecls += props;
        importDecls += imports;
      }
    }
    if (!customElementDecls) {
      throw Error('found no type declarations for the svelte components');
    }
    const customElementsDts = await formatSourceText(
      // https://svelte.dev/docs/svelte/typescript#Enhancing-built-in-DOM-types
      `${importDecls}
${propsDecls}
declare module 'svelte/elements' {
  export interface SvelteHTMLElements {
    ${customElementDecls}
  }
}
export {};
`,
      { parser: 'typescript' },
    );
    return customElementsDts;
  } finally {
    await rm(path.resolve(root, './tsconfig.tsbuildinfo'), { force: true });
  }
}

function generateUniqueIdentifier(text: string): string {
  const hash = createHash('sha256');
  hash.update(text, 'utf8');
  const ident = `CustomElement${hash.digest('hex').substring(0, 8)}`;
  hash.destroy();
  return ident;
}

async function getComponentDtsFiles({ outputTo, root, srcDir }: {
  readonly root: string;
  readonly srcDir: string;
  readonly outputTo: string;
}): Promise<string[]> {
  await runSveltePackage({ outputTo, root, srcDir });

  const dtsFilesRel = await Array.fromAsync(
    glob('**/*.svelte.d.ts', { cwd: outputTo }),
  );
  const dtsFilesAbs = dtsFilesRel.map((name) => path.resolve(outputTo, name));
  return dtsFilesAbs;
}

function getComponentPropsTypeName(
  dtsSourceFile: ts.SourceFile,
): string | undefined {
  const declaredVars = new Map<string, ts.VariableDeclaration>();
  let propsTypeName: string | undefined;

  function visit(node: ts.Node): void {
    if (ts.isVariableDeclaration(node)) {
      // visited: declare const ComponentName: import("svelte").Component<...>;
      declaredVars.set(node.name.getText(dtsSourceFile), node);
    } else if (ts.isExportAssignment(node)) {
      // visited: export default ComponentName;
      const name = node.expression.getText(dtsSourceFile);
      const decl = declaredVars.get(name);
      assert.ok(decl?.type, 'unable to get default export');
      assert.ok(ts.isImportTypeNode(decl.type), 'no import node');
      const propsType = decl.type.typeArguments?.[0];
      assert.ok(propsType, 'no props type');
      assert.ok(ts.isTypeReferenceNode(propsType), 'not type ref node');
      propsTypeName = propsType.typeName.getText(dtsSourceFile);
    }
    ts.forEachChild(node, visit);
  }
  ts.forEachChild(dtsSourceFile, visit);
  return propsTypeName;
}

async function getCustomElementProps(
  dtsFileName: string,
  printer: ts.Printer,
): Promise<
  [propsDecl: string, customElementDecl: string, importDecl: string] | null
> {
  const svFileName = dtsFileName.replace('.d.ts', '');
  try {
    await stat(svFileName);
  } catch {
    return null;
  }
  const svSourceText = await readFile(svFileName, { encoding: 'utf8' });
  const ast = parseSvelteComponent(svSourceText, { modern: true });
  const customElementName = ast.options?.customElement?.tag;

  if (!customElementName) {
    return null;
  }
  const generatedName = generateUniqueIdentifier(dtsFileName);
  const dtsSourceText = await readFile(dtsFileName, { encoding: 'utf8' });
  const dtsSourceFile = ts.createSourceFile(dtsFileName, dtsSourceText, {
    languageVersion: ts.ScriptTarget.ESNext,
  });
  const propsTypeName = getComponentPropsTypeName(dtsSourceFile);
  interface ImportedModules {
    readonly defaultImports: Set<string>;
    readonly namedImports: Set<string>;
    readonly namespaceImports: Set<string>;
  }
  const importedModules = new Map<string, ImportedModules>();
  let propsDecl = '';

  if (propsTypeName) {
    const transformerFactory: ts.TransformerFactory<ts.SourceFile> = (ctx) => {
      return (sourceFile) => {
        function visit(node: ts.Node): ts.Node | undefined {
          if (
            ts.isImportDeclaration(node)
            && node.importClause
            && ts.isStringLiteralLike(node.moduleSpecifier)
          ) {
            const { importClause } = node;
            const moduleName = node.moduleSpecifier.text;
            const moduleList = importedModules.get(moduleName) ?? {
              defaultImports: new Set(),
              namedImports: new Set(),
              namespaceImports: new Set(),
            };
            importedModules.set(moduleName, moduleList);

            if (importClause.name) {
              moduleList.defaultImports.add(
                importClause.name.getText(dtsSourceFile),
              );
            } else if (importClause.namedBindings) {
              if (ts.isNamedImports(importClause.namedBindings)) {
                for (const element of importClause.namedBindings.elements) {
                  moduleList.namedImports.add(
                    element.getText(dtsSourceFile).replace(/^type\s+/, ''),
                  );
                }
              } else if (ts.isNamespaceImport(importClause.namedBindings)) {
                moduleList.namespaceImports.add(
                  importClause.namedBindings.getText(dtsSourceFile),
                );
              }
            }
            return undefined;
          }
          if (
            ts.isInterfaceDeclaration(node)
            || ts.isTypeAliasDeclaration(node)
          ) {
            if (node.name.getText(sourceFile) === propsTypeName) {
              if (ts.isInterfaceDeclaration(node)) {
                return ts.factory.updateInterfaceDeclaration(
                  node,
                  node.modifiers,
                  ts.factory.createIdentifier(generatedName),
                  node.typeParameters,
                  node.heritageClauses,
                  node.members,
                );
              } else {
                return ts.factory.updateTypeAliasDeclaration(
                  node,
                  node.modifiers,
                  ts.factory.createIdentifier(generatedName),
                  node.typeParameters,
                  node.type,
                );
              }
            }
          }
          return ts.isSourceFile(node)
            ? ts.visitEachChild(node, visit, ctx)
            : undefined;
        }
        return ts.visitNode(sourceFile, visit) as ts.SourceFile;
      };
    };
    const result = ts.transform(dtsSourceFile, [transformerFactory]);
    assert.equal(
      result.transformed.length,
      1,
      `unexpected transformed length: ${result.transformed.length}`,
    );
    assert.ok(result.transformed[0], 'unexpected no transformed');
    propsDecl = printer.printFile(result.transformed[0]).trim();
    result.dispose();
  } else {
    const customElementProps = ast.options?.customElement?.props;
    if (customElementProps) {
      // read component props declaration from <svelte:options>
      LOOP: for (const [name, { type }] of Object.entries(customElementProps)) {
        switch (type) {
          case undefined: {
            continue LOOP;
          }
          case 'Array': {
            propsDecl += `'${name}'?: readonly unknown[];`;
            break;
          }
          case 'Object': {
            propsDecl += `'${name}'?: {};`;
            break;
          }
          default: {
            propsDecl += `'${name}'?: ${type.toLowerCase()};`;
            break;
          }
        }
      }
      propsDecl = `interface ${generatedName}{${propsDecl}}`;
    }
  }
  let importDecl = '';
  for (
    const [
      specifier,
      { defaultImports, namedImports, namespaceImports },
    ] of importedModules.entries()
  ) {
    for (const name of defaultImports) {
      importDecl += `import ${name} from '${specifier}';`;
    }
    if (namedImports.size > 0) {
      importDecl += 'import '
        + `{${Array.from(namedImports).join(',')}} from '${specifier}';`;
    }
    for (const namespace of namespaceImports) {
      importDecl += `import ${namespace} from '${specifier}';`;
    }
  }
  return [
    propsDecl,
    propsDecl
      ? `'${customElementName}': ${generatedName};`
      : `'${customElementName}': HTMLAttributes<HTMLElement>;`,
    importDecl,
  ];
}
