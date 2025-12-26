## keystoneについて
keystoneは統合版マインクラフトのビヘイビアパックで使用できるAPIである
ScriptAPIのラッパーライブラリです。

## 作成時
- src/ 配下でプラグインを作成できます
- プラグインの動作を確認したい場合は `docker compose up` を行うと自動でコンパイルされ、dist_bihavior_pack/ に成果物が出力されます
- ライブラリとして配布したい場合は `npm run build:lib` を行うと dist/ に成果物が出力されます
