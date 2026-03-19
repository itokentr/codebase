# AI Agent Guide

This document is written in Japanese.<br>
Respond with Japanese in any chat sessions.

このドキュメントは、このワークスペースで作業する AI エージェントのためのコンテキスト情報とルールをまとめたものです。

内容が確定していないため、書かれていることが現状と異なる場合や、記載されていない場合があります。

## AI とユーザーの自然言語によるコミュニケーション

- コード内のコメントやドキュメント、およびユーザーとの対話の回答には、可能な限り日本語を使用してください。
- 日本語での表現が困難または不自然になる場合は、英語を使用してください。

## ワークスペース概要

このワークスペースは、[Turborepo](https://turborepo.dev/) で管理されるモノレポ ([npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces)) として構成されています。

### ディレクトリ構造

- [apps](../apps/): アプリケーション
- [internal](../internal/): ワークスペース全体の共有設定・ツール
  - [configs](../internal/configs/): 共有の設定ファイル (tsconfig.json など)
  - [test](../internal/test/): テストランナーの抽象化レイヤー（Bun/Node 両対応用）
  - [vite](../internal/vite/): Vite ビルド設定の共通化
- [packages](../packages/): 再利用可能なライブラリ群

## 技術スタック

### JavaScript/TypeScript

- ランタイムには主に [Bun](https://bun.sh/) を使用しています。
  - ただし、ランタイムの API は Node のもの (`node:path` など) を参照しています。
    - Bun が対応していない Node の API を利用する場合は Node でスクリプトを実行します。

### パッケージマネージャ

- Bun を使用しています。

### フォーマッター

- [dprint](https://dprint.dev/) を使用しています。
  - コードを生成する場合は、可能であれば [dprint.json](../dprint.json) の内容を参照して、その設定に沿ったフォーマットを適用してください。
  - あるいは `dprint fmt` コマンドを対象となるコードに実行してその結果を出力するか、既存のコードからルールが推測して書いても構いません。

### リンター

- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) を使用しています。

### バージョン管理

- Git を使用しています。
- [husky](https://github.com/typicode/husky) によっていくつかのフックを利用しています。[.husky](../.husky) ディレクトリを参照してください。
- コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) に従って記述します。
  - メッセージのリンターには [commitlint](https://github.com/conventional-changelog/commitlint/tree/master) を使っています。
  - メッセージのリンターを起動するフックは [commit-msg](.husky/commit-msg) です。
- コミット時にコードのリンター `oxlint` を実行します。
  - コードのリンターを起動するフックは [pre-commit](.husky/pre-commit) です。
  - フックから実行されるのは [lint-staged](https://github.com/lint-staged/lint-staged) です。実行内容の詳細は [lint-staged.config.js](../lint-staged.config.js) を参照してください。

## テスト

### TypeScript

- テストファイルを生成する際の命名ルールは `*.test.ts` です。
  - コードに JSX を含む場合は `*.test.tsx` です。
  - Svelte の API (`$state` など) を含む場合は `*.svelte.test.ts` です。
- その他のルールは [test-typescript](.agents/rules/test-typescript.md) を参照してください。
- ソースコードを書く際のルールは [write-typescript](.agents/rules/write-typescript.md) を参照してください。
