import { PerspectiveCamera } from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Camera {
  experience: Experience | null = null;
  instance: PerspectiveCamera | null = null;
  orbitControls: OrbitControls | null = null;
  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance;
    if (!this.experience.sizes) {
      Error("Sizes not initialized");
      return;
    }
    this.setInstance();
    // this.setOrbitControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      75,
      this.experience?.sizes?.aspectRatio,
      0.1,
      100
    );
    this.instance.position.set(2, 0, 10);
    this.experience?.scene?.add(this.instance);
  }

  setOrbitControls() {
    if (!this.instance || !this.experience?.renderer?.instance) return;
    this.orbitControls = new OrbitControls(
      this.instance,
      this.experience.renderer.instance.domElement
    );
    this.orbitControls.enableDamping = true;
  }

  resize() {
    this.instance!.aspect = this.experience?.sizes?.aspectRatio!;
    this.instance!.updateProjectionMatrix();
  }

  update() {
    // this.orbitControls?.update();
    this.instance?.updateProjectionMatrix();
  }
}
