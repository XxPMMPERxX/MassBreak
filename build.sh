#!/bin/sh

echo "ビルド開始...";

# TypeScriptコンパイラを実行
npx tsc > /dev/null 2>&1 || true

# manifest.jsonからUUIDを抽出する関数
extract_uuid() {
  manifest_file=$1
  grep -A 10 '"header"' "$manifest_file" | grep '"uuid"' | head -1 | sed 's/.*"uuid"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/'
}

# manifest.jsonからバージョンを抽出する関数
extract_version() {
  manifest_file=$1
  grep -A 10 '"header"' "$manifest_file" | grep '"version"' | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*\[\([^]]*\)\].*/\1/'
}

# パックJSONファイルを更新する関数（単一エントリで上書き）
update_pack_json() {
  pack_json=$1
  pack_id=$2
  version=$3

  mkdir -p "$(dirname "$pack_json")"

  cat > "$pack_json" << EOF
[
  {
    "pack_id": "$pack_id",
    "version": [$version]
  }
]
EOF
}

# BP（ビヘイビアパック）のマニフェストを処理
if [ -d "src/BP" ]; then
  find src/BP -name "manifest.json" -type f | while read -r manifest; do
    uuid=$(extract_uuid "$manifest")
    version=$(extract_version "$manifest")
    if [ -n "$uuid" ]; then
      update_pack_json "worlds/DevWorld/world_behavior_packs.json" "$uuid" "$version"
    fi
  done
fi

# RP（リソースパック）のマニフェストを処理
if [ -d "src/RP" ]; then
  find src/RP -name "manifest.json" -type f | while read -r manifest; do
    uuid=$(extract_uuid "$manifest")
    version=$(extract_version "$manifest")
    if [ -n "$uuid" ]; then
      update_pack_json "worlds/DevWorld/world_resource_packs.json" "$uuid" "$version"
    fi
  done
fi

echo "ビルド完了";
