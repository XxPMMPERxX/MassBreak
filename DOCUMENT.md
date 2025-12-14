# Keystone

## イベント

#### 単一ファイルの場合のサンプル
```ts
import { Player } from '@minecraft/server';
import { EventManager, Priority } from 'keystonemc';

// 一回限りのおまじない
EventManager.initialize();

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
  
#### ファイル分けした場合の推奨サンプル
```ts
// --------------------- index.ts ---------------------
import { EventManager } from 'keystonemc';
import { registerPlayerSpawnHandlers } from './playerSpawn';
import { registerButtonPushHandlers } from './buttonPush';


EventManager.initialize();

registerPlayerSpawnHandlers();
registerButtonPushHandlers();

// --------------------- playerSpawn.ts ---------------------
import { EventManager, Priority } from 'keystonemc';

export function registerPlayerSpawnHandlers() {

  EventManager.registerAfter('playerSpawn', {
    handler(event) {},
    priority: Priority.LOWEST
  });

  EventManager.registerAfter('playerSpawn', {
    handler(event) {},
    priority: Priority.MONITOR
  });
}

// --------------------- buttonPush.ts ---------------------
import { EventManager, Priority } from 'keystonemc';

export function registerButtonPushHandlers() {

  EventManager.registerAfter('buttonPush', {
    handler(event) {}
  });
}
```
<br />

## タイマー
#### 継続処理サンプル
```ts
import { Player } from '@minecraft/server';
import { repeating } from 'keystonemc';

const timer10s = repeating({
  every: 1*20, // 間隔
  endless: false, // 無限に続けるかどうか
  max: 10*20, // 最大ティック
  silenceWhenStopped: false, // timer.stop()で止めたときに処理をさせないか
  run(tick) { // 毎Nティック処理
    player.sendMessage(`${Math.floor(tick/20)}`); // 現在の秒数をメッセージで送信
  },
  cancel() { // タイマーがキャンセルされたときの処理
    player.sendMessage('タイマーが終了しました！');
  },
  final() { // 最大ティックまで到達したときの処理
    player.sendMessage('最大に達しました');
  }
});

// タイマーの一時停止
// silenceWhenStoppedがfalseの場合、run()が処理され続ける。
timer10s.stop();

// タイマーの再開
timer10s.resume();

// タイマーの終了
timer10s.cancel();
```
<br />

#### 遅延処理サンプル
```ts
import { Player } from '@minecraft/server';
import { delayed } from 'keystonemc';

// 2秒後の処理
delayed(
  2*20, // 遅延するティック
  () => { // 遅延処理
    player.sendMessage('2008年11月20日 発売！');
  },
  () => {
    // タイマーがキャンセルされたときの処理
  }
);

// 1秒後の処理
delayed(1*20, () => player.sendMessage('どうぶつの森'));

// 即座に処理
player.sendMessage('街へいこうよ');
```
<br />

#### 待機処理サンプル
```ts
import { Player } from '@minecraft/server';
import { sleep } from 'keystonemc';

(async() => {
  player.sendMessage('街へいこうよ');

  await sleep(1*20); // 1秒待機

  player.sendMessage('どうぶつの森');
  
  await sleep(1*20); // 1秒待機

  player.sendMessage('2008年11月20日 発売！');
})();
```
非同期を用いることで、上から下へ流れる処理を実装できます。  
これをイベントで応用する場合は、以下のようにlistenerの処理部分を`handler()`ではなく `async handler()`にします。
```ts
// ボタンを押した後、アクションバーでカウントダウンを行い、ボタンのタイプをメッセージで伝える処理
EventManager.registerAfter('buttonPush', {
  async handler(event) {
    const player = event.source;
    if (!(player instanceof Player)) return;
    
    const screen = player.onScreenDisplay;
    
    // forとsleepを駆使して継続処理を再現
    for (let i = 3; i > 0; i--) {
      if (screen.isValid) {
        screen.setActionBar(`${i}秒後にボタンのタイプを送信します`);
      }
      await sleep(1*20);
    }

    player.sendMessage(`${event.block.typeId}`);
  }
});
```
asyncで処理を行う場合、メインスレッドの処理を無視する形になるため、`playerSpawn`などのクライアント側の読み込みが関わってくる処理では、冒頭にある程度の遅延を持たせないと、処理が省略されるケースがあります。
```ts
EventManager.registerAfter('playerSpawn', {
  async handler(event) {
    if (!event.initialSpawn) return;

    const player = event.player;
    player.sendMessage('5秒後にランダムな数字を送信します...');

    // プレイヤー側の読み込みが終わる前にここまで実行が進んでしまう。
    // sleepに差し掛かるか、進行している状態になりうる。
    await sleep(5*20);

    player.sendMessage(`${Math.random()}`);
  }
});
```
```ts
EventManager.registerAfter('playerSpawn', {
  async handler(event) {

    // 処理の初めにある程度の遅延を入れる
    await sleep(10*20);

    if (!event.initialSpawn) return;

    const player = event.player;
    player.sendMessage('5秒後にランダムな数字を送信します...');

    await sleep(5*20);

    player.sendMessage(`${Math.random()}`);
  }
});
```
基本的にクライアント側の読み込みが関わってくる処理は全て同期的に行うことをおすすめします。  
例えば上のプログラムはTimerを用いて書き換えられます。
```ts
EventManager.registerAfter('playerSpawn', {
  handler(event) {
    if (!event.initialSpawn) return;

    const player = event.player;
    player.sendMessage('5秒後にランダムな数字を送信します...');

    delayed(5*20, () => player.sendMessage(`${Math.random()}`));
  },
  priority: Priority.LOWEST
});
```
<br />

## サンプルコード
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
