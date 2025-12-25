# Keystone

## イベント

### 単一ファイルの場合のサンプル
```ts
import { EventManager, Priority } from 'keystonemc';

// 例:プレイヤーがスポーンした時
EventManager.registerAfter('playerSpawn', {
  handler(event) {
    if (!event.initialSpawn) return; // 初回参加時以外は無視
    event.player.sendMessage('どうぶつの森');
  }
});

EventManager.registerAfter('playerSpawn', {
  handler(event) {
    if (!event.initialSpawn) return; // 初回参加時以外は無視
    event.player.sendMessage('おいでよ');
  },
  priority: Priority.LOWEST // 優先度
});
```

`registerAfter`及び`registerBefore`の第一引数である`eventName`は、しっかりKeystoneが読み込まれていればクォーテーションを入力したときに利用可能なイベント名の補完が出ます。  
Priorityは優先度が高い順に`LOWEST > LOW > NORMAL > HIGH > HIGHEST > MONITOR`があります。`MONITOR`が一番最後に処理されます。 引数未指定のデフォルトは`NORMAL`です。
<br />
  
### ファイル分けした場合の推奨サンプル
```ts
// --------------------- index.ts ---------------------
import './playerSpawn';
import './buttonPush';

// --------------------- playerSpawn.ts ---------------------
import { EventManager, Priority } from 'keystonemc';

EventManager.registerAfter('playerSpawn', {
  handler(event) {},
  priority: Priority.LOWEST
});

EventManager.registerAfter('playerSpawn', {
  handler(event) {},
  priority: Priority.MONITOR
});

// --------------------- buttonPush.ts ---------------------
import { EventManager } from 'keystonemc';

EventManager.registerAfter('buttonPush', {
  handler(event) {}
});

```
<br />

## タイマー
### 継続処理サンプル
```ts
import { repeating } from 'keystonemc';

const timer20s = repeating({
  every: 1*20, // 間隔
  max: 20*20, // 最大ティック
  runWhileStopped: true, // 停止してても run() を呼び出すか
  run(elapsedTicks: number) { // 毎Nティック処理
    // 退室した可能性 → 強制キャンセル
    if (!player || !player.isValid) {
      return timer20s.cancel(true);
    }

    // 飛行 → キャンセル
    if (player.isFlying) {
      return timer20s.cancel();
    }
    
    // スニークしてる間はタイマーストップ
    if (player.isSneaking && !timer20s.isStopped()) {
      timer20s.stop();
    }

    // スニークしてないときはタイマー再開
    if (!player.isSneaking && timer20s.isStopped()) {
      timer20s.resume();
    }

    // 現在の秒数をアクションバーに送信
    player.onScreenDisplay?.setActionBar(`${Math.floor(elapsedTicks/20)}`);
  },
  cancel() { // タイマーがキャンセルされたときの処理
    player.sendMessage('飛んだのでタイマーが終了しました！');
  },
  final() { // 最大ティックまで到達したときの処理
    player.sendMessage('最大に達しました');
  }
});
```
<br />

### 遅延処理サンプル
```ts
import { delayed } from 'keystonemc';

// 2秒後の処理
delayed(
  2*20, // 遅延するティック
  () => { // 遅延処理
    player.sendMessage('2008年11月20日 発売！');
  }
);

// 1秒後の処理
delayed(1*20, () => player.sendMessage('どうぶつの森'));

// 即座に処理
player.sendMessage('街へいこうよ');
```
<br />

### 条件待機処理サンプル
```ts
import { until } from 'keystonemc';

until({
  when: () => player.isSneaking,
  run: () => player.sendMessage('10秒以内にスニークをしました'),
  onTimeout: () => player.sendMessage('10秒以内にスニークをしてくれませんでした'),
  timeout: 10*20
});
```
`until`を用いることで、任意の動作や状態が完了するまで待機してその後処理をすることができるようになります。  
非同期で用いる場合は`until`ではなく`waitUntil`を使ってください。

<br />

<details>

<summary>フレンド申請の処理 (until使用)</summary>

```ts
import { EventManager, until } from 'keystonemc';

EventManager.registerBefore('chatSend', {
  handler(event) {
    if (event.message !== '#friend accept') return;
    event.cancel = true;
    
    const player = event.sender;
    player.sendMessage('「Bob」のフレンド申請を承諾しました。');
    player.sendMessage('キャンセルする場合は、5秒以内にスニークをしてください。');

    // 待機
    until({
      when: () => player.isSneaking,
      run: () => player.sendMessage('フレンド申請の承諾を取り消しました。'),
      onTimeout: () => player.sendMessage('フレンド申請の承諾が確定しました。'),
      timeout: 5*20
    });
  },
});
```

</details>  

<details>

<summary>参加してから動き出すのを待機 (waitUntil使用)</summary>

```ts
import { EventManager, waitUntil } from 'keystonemc';

EventManager.registerAfter('playerSpawn', {
  async handler(event) {
    if (!event.initialSpawn) return;
    const player = event.player;

    // ワールドにスポーンした瞬間のRotationを保管
    const rotation = player.getRotation();

    // 動き出すまで待機
    // 高確率でクライアントの読み込みが終わった瞬間に一瞬首が動く
    await waitUntil(() => (
      Math.abs(rotation.x - player.getRotation().x) > 1 ||
      Math.abs(rotation.y - player.getRotation().y) > 1)
    );

    // メッセージ送信
    player.sendMessage('Welcome!');
  },
});
```

</details>  

<br />

### スリープ処理サンプル
```ts
import { sleep } from 'keystonemc';

(async() => {
  player.sendMessage('街へいこうよ');

  await sleep(1*20); // 1秒待機

  player.sendMessage('どうぶつの森');
  
  await sleep(1*20); // 1秒待機

  player.sendMessage('2008年11月20日 発売！');
})();
```
`sleep`を用いることで、上から下へ流れる処理を実装できます。  
これをイベントで応用する場合は、以下のようにlistenerの処理部分を`handler()`ではなく `async handler()`にします。

非同期で処理を行う場合、メインスレッドの処理を無視する形になるため、`playerSpawn`などのクライアント側の読み込みが関わってくる処理では、冒頭にある程度の遅延を持たせないと、処理が省略されるケースがあります。

基本的にクライアント側の読み込みが関わってくる処理は全て同期的に行うことをおすすめします。  
<br />

<details>

<summary>ロードを意図的に入れた参加時のタイトルアニメーション (sleep使用)</summary>

```ts
import { EventManager, Priority, sleep } from 'keystonemc';

// 参加時のタイトルアニメーション
EventManager.registerAfter('playerSpawn', {
  async handler(event) {
    if (!event.initialSpawn) return;

    const player = event.player;

    // ここから 「Now loading...」を表示させる処理
    const wait = Math.floor(Math.random() * 4) + 3; // 3～6秒のランダムなロードを再現
    let dot = 0;
    for (let i = 0; i < wait; i++) {
      if (++dot == 4) dot = 0;
      player.onScreenDisplay?.setActionBar(`Now loading${'.'.repeat(dot)}`);
      await sleep(1*20);
    }

    // タイトルメッセージ
    let text = '';
    for (const ch of 'Welcome!') {
      text += ch;
      player.onScreenDisplay?.setTitle(text, {
        fadeInDuration: 0,
        stayDuration: 1*20,
        fadeOutDuration: 0
      });

      player.playSound('note.bit');

      await sleep(2);
    }
  },
  priority: Priority.LOWEST
});
```

</details>

<details>

<summary>ボタンを押したときに木材のタイプをカウントダウン後に送信 (sleep使用)</summary>

```ts
import { Player } from '@minecraft/server';
import { EventManager, sleep } from 'keystonemc';

// ボタンを押したときに何のボタンかをカウントダウン後に送信
EventManager.registerAfter('buttonPush', {
  async handler(event) {
    const button = event.block;
    const player = event.source;
    if (!(player instanceof Player)) return;

    const screen = player.onScreenDisplay;

    const wait = 3;
    for (let i = wait; i > 0; i--) {
      if (screen.isValid) {
        screen.setActionBar(`${i}秒後にボタンのタイプを送信します`);
      }
      await sleep(1*20);
    }

    player.sendMessage(`${button.typeId}`);
  }
});
```

</details>
