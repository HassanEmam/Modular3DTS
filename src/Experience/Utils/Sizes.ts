import { EventEmitter } from "./EventEmitter";

export default class Sizes extends EventEmitter {
  width: number = 0;
  height: number = 0;
  aspectRatio: number = 0;
  pixelRatio: number = 0;

  constructor(container: HTMLElement) {
    super();

    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.width = container.clientWidth;
      this.height = container.clientHeight;
      this.aspectRatio = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.trigger("resize");
    });
  }
}
