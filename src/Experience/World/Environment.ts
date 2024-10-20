import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  sunLight?: THREE.DirectionalLight;
  ambientLight?: THREE.AmbientLight;
  experience: Experience;

  constructor() {
    this.experience = Experience.instance;
    this.setSunlight();
    this.setAmbientLight();
  }
  setSunlight() {
    this.sunLight = new THREE.DirectionalLight(0xffffff, 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    // this.sunLight.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(0, 5, 5);
    this.experience?.scene!.add(this.sunLight);
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.experience?.scene!.add(this.ambientLight);
  }
}
