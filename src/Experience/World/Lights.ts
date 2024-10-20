import Experience from "../Experience";
import * as THREE from "three";

export default class Lights {
  dirLight: THREE.DirectionalLight;
  experience: Experience;
  scene: THREE.Scene;
  ambientLight: THREE.AmbientLight;

  constructor(experience: Experience) {
    this.experience = experience;
    this.scene = experience.scene as THREE.Scene;

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.dirLight.position.set(0, 10, 10);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);
    this.scene.add(this.ambientLight);
  }
}
