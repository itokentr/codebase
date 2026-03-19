---
trigger: glob
globs: */*/test/**/*.test.ts,*/*/test/**/*.test.tsx
---

# TypeScript ソースコードのテストについて

## テストコードを生成する場合のルール

- テストファイルを生成するときは、テスト対象のファイルが属するモノレポ・プロジェクトのディレクトリ直下に **test** ディレクトリがあれば (例: [packages/string/test](../../packages/string/test)) その中に生成してください。
  - 無い場合は、テスト対象のファイルと同じディレクトリ内に生成してください。

## テストを実行するランタイム

- そのプロジェクトの package.json に test というスクリプトがあれば、`bun run test` を実行してください。
