import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Controls from "./Controls";
import Mouse from "./Utils/Mouse";
import Raycaster from "./Raycaster";

export default class Experience {
  static instance: Experience;
  container?: HTMLElement;
  renderer: Renderer | null = null;
  sizes: Sizes | null = null;
  time: Time | null = null;
  scene: THREE.Scene | null = null;
  camera: Camera | null = null;
  world: World | null = null;
  controls: Controls | null = null;
  mouse: Mouse | null = null;
  raycaster: Raycaster | null = null;

  constructor(container: HTMLElement) {
    if (Experience.instance) return Experience.instance;
    Experience.instance = this;
    this.container = container;

    //setup
    this.sizes = new Sizes(container);
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.renderer = new Renderer();
    this.mouse = new Mouse();
    this.camera = new Camera();
    this.world = new World(this);
    this.raycaster = new Raycaster(this);
    this.controls = new Controls(this);

    // listen to resize event from sizes class
    this.sizes.on("resize", () => {
      this.resize();
    });

    // listen to tick event from time class
    this.time.on("tick", () => {
      this.update();
    });

    this.mouse.on("clicked", (event: MouseEvent) => {
      event.preventDefault();
      this.clickEvent();
    });

    this.raycaster.on("objectSelected", (object: any) => {
      console.log("objectSelected", object);
      this.controls?.objectSelected(object);
    });

    this.raycaster.on("objectDeselected", () => {
      console.log("objectDeselected");
      this.controls?.objectDeSelected();
    });
  }

  clickEvent() {
    this.renderer?.update();
    this.raycaster?.clicked();
  }

  //function to implement the resize event to update camera and renderer
  resize() {
    this.camera?.resize();
    this.renderer?.resize();
  }

  update() {
    // console.log(this.time.elapsed);
    this.camera?.update();
    this.renderer?.update();
    this.raycaster?.refresh();
    this.controls?.update();
  }

  createScene() {
    const scene = new THREE.Scene();
    return scene;
  }

  destroy() {
    // Traverse the whole scene
    this.scene?.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera?.orbitControls?.dispose();
    this.renderer?.instance?.dispose();
  }
}
