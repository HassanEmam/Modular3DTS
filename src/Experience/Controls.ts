import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import * as THREE from "three";
import Experience from "./Experience";
import Camera from "./Camera";
import Renderer from "./Renderer";

export default class Controls {
  experience: Experience | null = null;
  camera: Camera | null = new Camera();
  renderer: Renderer = new Renderer();
  scene: THREE.Scene | null = new THREE.Scene();
  canvas: HTMLCanvasElement | undefined = document.createElement("canvas");
  controls: any;
  transformControls: any;
  lp: THREE.Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  constructor(experience: Experience) {
    console.log("Controls Module");
    console.log(experience);
    this.experience = experience;
    if (!this.experience) return;
    this.camera = experience.camera;
    this.renderer = experience.renderer as Renderer;
    this.scene = experience.scene;
    this.canvas = this.renderer?.instance?.domElement;
    this.setControls();
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "g":
          this.transformControls.setMode("translate");
          break;
        case "r":
          this.transformControls.setMode("rotate");
          break;
        case "s":
          this.transformControls.setMode("scale");
          break;
        case "Escape":
          this.transformControls.detach();
          break;
        case "w":
          this.transformControls.setSpace("world");

          break;
        case "l":
          this.transformControls.setSpace("local");
          break;
      }
    });
  }

  setControls() {
    if (
      !this.camera?.instance ||
      !this.renderer.instance ||
      !this.experience?.scene
    )
      return;
    this.controls = new OrbitControls(
      this.camera.instance,
      this.renderer.instance.domElement
    );
    console.log("Orbit", this.controls);
    this.transformControls = new TransformControls(
      this.camera.instance,
      this.renderer.instance.domElement
    );
    this.transformControls.setMode("translate");
    // this.experience.scene.add(this.transformControls);

    this.controls.enableDamping = true;
  }

  objectSelected(object: THREE.Mesh) {
    if (object instanceof THREE.Mesh) {
      // for (let ob of this.scene.children) {
      //     if (ob instanceof TransformControls) {
      //         this.scene.remove(ob)
      //     }
      // }
      this.transformControls.detach();
      this.transformControls.attach(object);
      this.experience?.scene?.add(this.transformControls.getHelper());
      // this.transformControls.position.set() ((this.getCenterPoint(object))
      this.transformControls.setSpace("local");
    }
    this.transformControls.addEventListener(
      "dragging-changed",
      (event: any) => {
        this.controls.enabled = !event.value;
        this.transformControls.object.geometry.computeBoundingBox();
        // const d = this.experience.world.animationData.animData.filter(
        //   (animData: any) => {
        //     return animData.element === this.transformControls.object.name;
        //   }
        // );
        // console.log("D****************", d[0]);
        if (event.value) {
          this.lp = this.transformControls.object.material.clippingPlanes;
          console.log(
            "lp",
            this.lp,
            this.transformControls.object.material.clippingPlanes
          );
        } else {
          console.log(this.lp);
        }
        const bb = this.transformControls.object.geometry.boundingBox;
        console.log("dragging-changed", bb, event.value);
        // this.experience.renderer.update()
      }
    );
    this.transformControls.addEventListener("change", () => {
      if (!this.experience) return;
      this.experience.update();
      // this.transformControls.object.material.clippingPlanes = []
      // console.log(this.transformControls)
    });
  }

  getCenterPoint(mesh: THREE.Mesh) {
    var middle = new THREE.Vector3();
    var geometry = mesh.geometry;

    geometry.computeBoundingBox();

    const bb = geometry?.boundingBox;

    middle.x = ((bb as THREE.Box3).max.x + (bb as THREE.Box3).min.x) / 2;
    middle.y = ((bb as THREE.Box3).max.y + (bb as THREE.Box3).min.y) / 2;
    middle.z = ((bb as THREE.Box3).max.z + (bb as THREE.Box3).min.z) / 2;

    return middle;
  }
  objectDeSelected() {
    console.log("Detaching");
    // this.transformControls.detach()
    this.controls.enabled = true;
  }

  update() {
    this.controls.update();
  }
}
