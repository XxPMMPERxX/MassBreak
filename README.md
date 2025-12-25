<p align="center">
		<picture>
			<source srcset="https://raw.githubusercontent.com/XxPMMPERxX/Keystone/main/.github/images/keystone_dark.png" media="(prefers-color-scheme: dark)">
			<img src="https://raw.githubusercontent.com/XxPMMPERxX/Keystone/main/.github/images/keystone.png" loading="eager" />
		</picture>
	<br>
	<b>～ ScriptAPI開発体験を刷新するTypeScriptベースのフレームワーク ～ </b><br /><br />
  <a href="https://nodei.co/npm/keystonemc/"><img src="https://nodei.co/npm/keystonemc.svg?data=d"></a>
</p>

## 概要
Keystoneとは、統合版MinecraftのBDS環境及びビヘイビア―パックのScriptAPIの開発を支援することを目的に作られたプロジェクトです。  
Mojangが提供するAPIでは難しい処理の実装を簡単に行えるようにしているほか、Vector3をはじめとした様々な拡張クラスを実装しています。  
JavaScriptの暗黙の型変換によるエラーで悩んでしまう時間を最小限になるように、TypeScriptを採用しています。  
  
- 🗃️ イベントの優先順位を指定できるので一つのサブスクライブに縛られる必要はありません！
- ⏰ 豊富なタイマーで幅広い処理をスタイリッシュに！
- 🛠️ スリープ処理や条件待機処理で上から下への処理記法を実現し、if地獄から脱却！
- 🔢 拡張されたAABBクラスやVector3クラスで複雑な計算を簡単に！

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

### ドキュメント
- [イベント](./DOCUMENT.md#イベント)
  - [単一ファイルの場合のサンプル](./DOCUMENT.md#単一ファイルの場合のサンプル)
  - [ファイル分けした場合の推奨サンプル](./DOCUMENT.md#ファイル分けした場合の推奨サンプル)
- [タイマー](./DOCUMENT.md#タイマー)
  - [継続処理サンプル](./DOCUMENT.md#継続処理サンプル)
  - [遅延処理サンプル](./DOCUMENT.md#遅延処理サンプル)
  - [条件待機処理サンプル](./DOCUMENT.md#条件待機処理サンプル)
  - [スリープ処理サンプル](./DOCUMENT.md#スリープ処理サンプル)
