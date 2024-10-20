import "./style.css";
// import * as THREE from "three";
import Experience from "./Experience/Experience";

const container = document.getElementById("app") as HTMLElement;
if (container) {
  const experience = new Experience(container);
  console.log(experience);
}
