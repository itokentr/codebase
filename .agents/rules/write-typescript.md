---
trigger: glob
globs: **/*.ts,**/*.tsx
---

# TypeScript のソースコードを生成する際のルール

tsconfig.json を参照し、原則としてその設定に沿ったコードになるようにしてください。

## フォーマット (ソースコードの整形)

- 可能であれば、ファイル冒頭の `import` 宣言を、VSCode の _TypeScript: Sort Imports_ コマンドと同じ結果になるように並べ替えてください。(概ねアルファベット順によるソートです)
