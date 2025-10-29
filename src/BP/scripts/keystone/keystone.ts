import { Scheduler } from './scheduler/scheduler';

class Keystone {
  scheduler: Scheduler = new Scheduler();

  constructor() {
    console.log('hello');
  }
}

export const keystone = new Keystone();
