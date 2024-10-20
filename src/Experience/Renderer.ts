import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  experience: Experience | null = null;
  instance: THREE.WebGLRenderer | null = null;

  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance;
    this.setInstance();
  }

  setInstance() {
    if (!this.experience || !this.experience.sizes) return;
    this.instance = new THREE.WebGLRenderer({ antialias: true });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.localClippingEnabled = true;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor("lightgrey", 1);
    this.instance.setSize(window.innerWidth, window.innerHeight);
    this.instance.setPixelRatio(Math.min(this.experience.sizes.pixelRatio, 2));
    this.experience.container?.appendChild(this.instance.domElement);
    console.log(this.instance, this.instance.clearColor());
  }

  resize() {
    console.log("resize", this.experience?.sizes);
    this.instance!.setSize(
      this.experience?.sizes?.width!,
      this.experience?.sizes?.height!
    );
    this.instance!.setPixelRatio(this.experience?.sizes?.pixelRatio!);
    this.instance?.render(
      this.experience?.scene!,
      this.experience?.camera?.instance!
    );
  }

  update() {
    this.instance?.render(
      this.experience?.scene!,
      this.experience?.camera?.instance!
    );
  }
}
