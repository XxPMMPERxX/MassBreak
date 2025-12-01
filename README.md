# Keystone
## 概要
BDS + ScriptAPI のフレームワーク

![alt text](image.png)  
<br />  

## 環境構築
1. Docker インストール
2. .env作成
```bash
cp .env.example .env
```
3. 起動
```bash
docker compose up -d
```
4. BDSログ確認
```bash
docker compose logs bds -f
```
5. サーバー終了
```bash
docker compose down
```
<br />

## 開発手順
1. src/ 配下にて TypeScript でコーディング (エントリとして必ず index.ts が必要です)
2. サーバー起動時に dist_behavior_pack/ 配下にビルドされます
3. ログを確認してデバッグなど
<br />

## ライブラリ・プラグインとして配布する場合
```bash
npm run build:lib
```
を行うと dist/ 配下にビルドされます  
<br />

## 推奨事項
- VSCodeで開発する場合 .vscode/extensions.json に記載の拡張機能を入れるとよいです
<br />

## ドキュメント
- [イベント](./DOCUMENT.md#イベント)
  - [単一ファイルの場合のサンプル](./DOCUMENT.md#サンプル)
  - [ファイル分けした場合の推奨サンプル](./DOCUMENT.md#ファイル分けした場合の推奨サンプル)
- [タイマー](./DOCUMENT.md#タイマー)
  - [継続処理サンプル](./DOCUMENT.md#継続処理サンプル)
  - [遅延処理サンプル](./DOCUMENT.md#遅延処理サンプル)
  - [待機処理サンプル](./DOCUMENT.md#待機処理サンプル)
- [サンプルコード](./DOCUMENT.md#サンプルコード)
