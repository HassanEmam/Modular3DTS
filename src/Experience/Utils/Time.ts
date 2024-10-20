import { EventEmitter } from "./EventEmitter";

export default class Time extends EventEmitter {
  delta: number;
  elapsed: number;
  start: number;
  current: number;

  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.delta = 16;
    this.elapsed = 0;
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.start;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.trigger("tick");
    this.trigger("tick");
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  update() {}
}
