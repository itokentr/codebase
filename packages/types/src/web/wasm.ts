// oxlint-disable typescript/no-empty-object-type typescript/no-unsafe-function-type
import type { Response } from './fetch.ts';

export interface CompileError extends Error {}

export interface Global<T extends ValueType = ValueType> {
  value: ValueTypeMap[T];
  valueOf(): ValueTypeMap[T];
}

export interface Instance {
  readonly exports: Exports;
}

export interface LinkError extends Error {}

export interface Memory {
  readonly buffer: ArrayBuffer;
  grow(delta: number): number;
}

export interface Module {}

export interface RuntimeError extends Error {}

export interface Table {
  readonly length: number;
  get(index: number): any;
  grow(delta: number, value?: any): number;
  set(index: number, value?: any): void;
}

export interface GlobalDescriptor<T extends ValueType = ValueType> {
  mutable?: boolean;
  value: T;
}

export interface MemoryDescriptor {
  initial: number;
  maximum?: number;
  shared?: boolean;
}

export interface ModuleExportDescriptor {
  kind: ImportExportKind;
  name: string;
}

export interface ModuleImportDescriptor {
  kind: ImportExportKind;
  module: string;
  name: string;
}

export interface TableDescriptor {
  element: TableKind;
  initial: number;
  maximum?: number;
}

export interface ValueTypeMap {
  anyfunc: Function;
  externref: any;
  f32: number;
  f64: number;
  i32: number;
  i64: bigint;
  v128: never;
}

export interface WebAssemblyInstantiatedSource {
  instance: Instance;
  module: Module;
}

export type ImportExportKind = 'function' | 'global' | 'memory' | 'table';
export type TableKind = 'anyfunc' | 'externref';
export type ExportValue = Function | Global | Memory | Table;
export type Exports = Record<string, ExportValue>;
export type ImportValue = ExportValue | number;
export type Imports = Record<string, ModuleImports>;
export type ModuleImports = Record<string, ImportValue>;
export type ValueType = keyof ValueTypeMap;

declare global {
  var WebAssembly: {
    readonly CompileError: {
      prototype: CompileError;
      new(message?: string): CompileError;
      (message?: string): CompileError;
    };
    readonly Global: {
      prototype: Global;
      new<T extends ValueType = ValueType>(
        descriptor: GlobalDescriptor<T>,
        v?: ValueTypeMap[T],
      ): Global<T>;
    };
    readonly Instance: {
      prototype: Instance;
      new(module: Module, importObject?: Imports): Instance;
    };
    readonly LinkError: {
      prototype: LinkError;
      new(message?: string): LinkError;
      (message?: string): LinkError;
    };
    readonly Memory: {
      prototype: Memory;
      new(descriptor: MemoryDescriptor): Memory;
    };
    readonly Module: {
      prototype: Module;
      new(bytes: ArrayBufferView | ArrayBuffer): Module;
      customSections(moduleObject: Module, sectionName: string): ArrayBuffer[];
      exports(moduleObject: Module): ModuleExportDescriptor[];
      imports(moduleObject: Module): ModuleImportDescriptor[];
    };
    readonly RuntimeError: {
      prototype: RuntimeError;
      new(message?: string): RuntimeError;
      (message?: string): RuntimeError;
    };
    readonly Table: {
      prototype: Table;
      new(descriptor: TableDescriptor, value?: any): Table;
    };
    compile(bytes: ArrayBufferView | ArrayBuffer): Promise<Module>;
    compileStreaming(source: Response | PromiseLike<Response>): Promise<Module>;
    instantiate(
      bytes: ArrayBufferView | ArrayBuffer,
      importObject?: Imports,
    ): Promise<WebAssemblyInstantiatedSource>;
    instantiate(
      moduleObject: Module,
      importObject?: Imports,
    ): Promise<Instance>;
    instantiateStreaming(
      source: Response | PromiseLike<Response>,
      importObject?: Imports,
    ): Promise<WebAssemblyInstantiatedSource>;
  };
}
