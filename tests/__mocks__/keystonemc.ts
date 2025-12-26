// Mock implementation of keystonemc for testing

type EventHandler<T = any> = {
  handler: (event: T) => void | Promise<void>;
};

/**
 * Mock EventManager for testing
 */
export class EventManager {
  private static handlers = new Map<string, EventHandler[]>();

  static registerAfter<T = any>(eventName: string, eventHandler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(eventHandler);
  }

  /**
   * テスト用: 登録されたハンドラーを取得
   */
  static getHandlers(eventName: string): EventHandler[] {
    return this.handlers.get(eventName) ?? [];
  }

  /**
   * テスト用: すべてのハンドラーをクリア
   */
  static clearHandlers(): void {
    this.handlers.clear();
  }

  /**
   * テスト用: イベントを発火
   */
  static async triggerEvent<T = any>(eventName: string, event: T): Promise<void> {
    const handlers = this.getHandlers(eventName);
    for (const handler of handlers) {
      await handler.handler(event);
    }
  }
}

/**
 * Mock delayed function for testing
 * テストでは遅延を無視して即座に実行
 */
export function delayed(ticks: number, callback: () => void): void {
  // テストでは即座に実行
  callback();
}
