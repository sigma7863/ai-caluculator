# ai-caluculator

React + TypeScript で作成した計算機コンポーネントのコレクション。

## サブプロジェクト

| プロジェクト | 説明 |
|---|---|
| `calculator/` | ベーシックな計算機コンポーネント |
| `calculator-nemotron-3-ultra-free` | Nemotron 3 Ultra バージョンの計算機（ダークモード対応、メモリ機能、計算履歴） |
| `calculator-north-mini-code-free` | North Mini Code バージョンの計算機（キーボード操作対応、トースト通知） |

## 主な機能

- 四則演算（加算・減算・乗算・除算）
- パーセント・平方根・符号反転
- メモリ機能（M+ / MR / MC）
- 計算履歴の表示
- ダークモード対応
- キーボード操作対応（Enter / Backspace / Escape など）
- angle モード切り替え（Deg / Rad）

## 技術スタック

- React
- TypeScript

## セットアップ

各サブプロジェクトディレクトリにソースファイルがあります。Vite や Create React App などのプロジェクト構造に組み込んでご利用ください。

```bash
# 例：Vite プロジェクトに追加する場合
npm install react react-dom
# src/components/Calculator.tsx などをコピーして使用
```

## ライセンス

MIT