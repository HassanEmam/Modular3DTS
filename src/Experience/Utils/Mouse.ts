import Experience from "../Experience";
import { EventEmitter } from "./EventEmitter";
import Sizes from "./Sizes";
import Renderer from "../Renderer";

export default class Mouse extends EventEmitter {
  cursor = { x: 0, y: 0 };
  point = { x: 0, y: 0 };
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  sizes: Sizes;

  constructor() {
    super();
    const experience = Experience.instance;
    this.canvas = experience?.renderer?.instance?.domElement!;
    this.container = this.canvas.parentElement!;
    this.renderer = experience.renderer!;
    this.sizes = experience.sizes!;

    document.addEventListener(
      "click",
      (event) => {
        this.update(event);
        this.trigger("clicked", [event]);
      },
      false
    );

    document.addEventListener("mousemove", (event) => {
      this.update(event);
      this.trigger("move", [event]);
    });
  }

  update(event: any) {
    let canvasBounds = this.container.getBoundingClientRect();

    this.cursor.x =
      ((event.clientX - canvasBounds.left) /
        (canvasBounds.right - canvasBounds.left)) *
        2 -
      1;
    this.cursor.y =
      -(
        (event.clientY - canvasBounds.top) /
        (canvasBounds.bottom - canvasBounds.top)
      ) *
        2 +
      1;

    this.point.x = event.clientX;
    this.point.y = event.clientY;
  }
}
