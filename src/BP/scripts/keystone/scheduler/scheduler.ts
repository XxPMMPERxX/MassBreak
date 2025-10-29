import { system } from '@minecraft/server';

export class Scheduler {
  static instance: Scheduler;

  constructor () {
    if (Scheduler.instance) {
      return Scheduler.instance;
    }
    Scheduler.instance = this;
  }

  /**
   * リピート処理
   * @param callback
   * @param period 
   * @param delay
   * @returns {number}
   */
  scheduleRepeatingTask(callback: ()=>undefined, period: number, delay: number = 0): number {
    let id: number = -1;

    system.runTimeout(() => {
      id = system.runInterval(() => callback, period);
    }, delay);

    return id;
  }

  /**
   * 遅延処理
   * @param callback
   * @param delay
   * @returns {number}
   */
  scheduleDelayedTask(callback: ()=>undefined, delay: number): number {
    return system.runTimeout(() => callback, delay);
  }
}
