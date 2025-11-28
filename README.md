# BDS + ScriptAPI のフレームワーク

![alt text](image.png)

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

## 開発手順
1. src/ 配下にて TypeScript でコーディング (エントリとして必ず index.ts が必要です)
2. サーバー起動時に dist_behavior_pack/ 配下にビルドされます
3. ログを確認してデバッグなど

## ライブラリ・プラグインとして配布する場合
```bash
npm run build:lib
```
を行うと dist/ 配下にビルドされます


## 推奨事項
- VSCodeで開発する場合 .vscode/extensions.json に記載の拡張機能を入れるとよいです

