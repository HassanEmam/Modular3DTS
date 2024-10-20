import * as THREE from "three";
import Camera from "./Camera";
import Experience from "./Experience";

import { EventEmitter } from "./Utils/EventEmitter";
import Mouse from "./Utils/Mouse";
import World from "./World/World";

// type originalMaterials = { [key: string]: THREE.Material }
export default class Raycaster extends EventEmitter {
  // origMaterial: originalMaterials[] = []

  experience: Experience;
  camera: Camera;
  pickableObjects: THREE.Mesh[];
  selected: string[];
  originalMaterials: { [key: string]: THREE.Material };
  highlightedMaterial: THREE.MeshBasicMaterial;
  world: World;
  mouse: Mouse;
  instance: any;
  scene: THREE.Scene;
  isAnim: boolean = false;

  constructor(experience: Experience) {
    super();
    this.pickableObjects = [];
    this.selected = [];
    this.originalMaterials = {};
    this.highlightedMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x00ff00,
    });
    this.experience = experience;
    this.camera = experience.camera as Camera;
    this.scene = experience.scene as THREE.Scene;
    this.world = experience.world as World;
    this.mouse = experience.mouse as Mouse;
    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.Raycaster();
    this.instance.setFromCamera(this.mouse.cursor, this.camera.instance);
    const group = this.scene.getObjectByName("world") as THREE.Group;
    for (let o in group.children) {
      let obj = group.children[o];

      if (obj instanceof THREE.Mesh) {
        this.pickableObjects.push(obj);
        this.originalMaterials[obj.uuid] = obj.material;
      }
    }
  }

  clicked() {
    this.instance.setFromCamera(this.mouse.cursor, this.camera.instance);
    let intersectedObject;

    this.selected = [];
    let intersects = this.instance.intersectObjects(this.pickableObjects);
    if (intersects.length > 0) {
      intersects.forEach((i: any) => {
        if (i.object.type === "Mesh") {
          intersectedObject = i.object;
          if (
            this.pickableObjects.indexOf(intersectedObject) > -1 &&
            this.selected.length === 0
          ) {
            this.selected.push(i.object.uuid);
            this.trigger("objectSelected", [intersectedObject]);
          }
        }
      });
    } else {
      intersectedObject = null;
      this.trigger("ObjectDeselected");
    }
    this.update(intersectedObject);
  }

  move() {
    if (!this.isAnim) {
      this.instance.setFromCamera(this.mouse.cursor, this.camera.instance);
      let intersectedObject;

      let intersects = this.instance.intersectObjects(this.pickableObjects);
      if (intersects.length > 0) {
        intersects.forEach((i: any) => {
          if (i.object.type === "Mesh") {
            intersectedObject = i.object;
            if (
              this.pickableObjects.indexOf(intersectedObject) > -1 &&
              this.selected.length === 0
            ) {
              this.selected.push(i.object.uuid);
              // this.trigger('objectSelected', [intersectedObject])
            }
          }
        });
      } else {
        intersectedObject = null;
      }
      this.update(intersectedObject);
    }
  }

  refresh() {
    const group = this.scene.getObjectByName("world") as THREE.Group;

    for (let o in group.children) {
      let obj = group.children[o];

      if (obj instanceof THREE.Mesh) {
        this.pickableObjects.push(obj);
        this.originalMaterials[obj.uuid] = obj.material;
      }
    }
  }

  update(intersectedObject: any) {
    if (!this.isAnim) {
      this.pickableObjects.forEach((o, i) => {
        if (
          intersectedObject !== null &&
          intersectedObject !== undefined &&
          intersectedObject instanceof THREE.Mesh
        ) {
          if (intersectedObject.uuid === o.uuid) {
            this.pickableObjects[i].material = this.highlightedMaterial;
          } else {
            this.pickableObjects[i].material = this.originalMaterials[o.uuid];
          }
        } else if (this.pickableObjects[i].uuid !== this.selected[0]) {
          this.pickableObjects[i].material = this.originalMaterials[o.uuid];
        }
      });
    }
  }
}
