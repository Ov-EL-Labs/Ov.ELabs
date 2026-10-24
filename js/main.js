/**
 * Ov.EL — main entry
 * - Three.js renderer for the .glb MacBook render
 * - GSAP animations (core + ScrollTrigger)
 * - Scroll-driven reveal for page sections
 * - Pause/reset controls for the 3D scene
 */

import gsap from "../node_modules/gsap/dist/gsap.min.js";
import { ScrollTrigger } from "../node_modules/gsap/dist/ScrollTrigger.min.js";
import * as THREE from "../js/three-r162.module.js";

// Register the ScrollTrigger plugin (required for scroll-driven animations)
gsap.registerPlugin(ScrollTrigger);

const modelEl = document.getElementById("macbookModel");
const stage = document.getElementById("macbookStage");
const btnToggle = document.getElementById("btnToggle");
const btnReset = document.getElementById("btnReset");
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

/* --------------------------------------------------------------------------
 * 3. The MacBook scene
 * -------------------------------------------------------------------------- */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(40, 520 / 420, 0.1, 100);
camera.position.set(0, 0.6, 3.2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(520, 420);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
stage.appendChild(renderer.domElement);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(2.5, 4, 2);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 8;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-2, 1, 3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
rimLight.position.set(0, -1, -2);
scene.add(rimLight);

const hemi = new THREE.HemisphereLight(0x8888ff, 0x444444, 0.6);
scene.add(hemi);

// Ground plane for shadows
const groundGeo = new THREE.PlaneGeometry(6, 6);
const groundMat = new THREE.ShadowMaterial({ opacity: 0.25, color: 0x000000 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.6;
ground.receiveShadow = true;
scene.add(ground);

// Load the GLB MacBook
let model;
let mixer;
let clock = new THREE.Clock();

async function loadModel() {
  try {
    const gltf = await THREE.GLTFLoader().loadAsync("/macbook_pro_14-inch_m5.glb");
    model = gltf.scene;

    // Scale to fit the 520px stage while keeping proportions
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const target = 2.2;
    const scale = target / maxDim;
    model.scale.setScalar(scale);

    model.position.y = 0;
    model.castShadow = true;
    model.receiveShadow = true;

    // Rotate slightly so we see a nice angle
    model.rotation.y = -0.35;

    scene.add(model);

    // Morph animation? This file has no animations, so we just keep it still.
    console.log("GLB loaded:", gltf);
  } catch (err) {
    console.error("Failed to load .glb:", err);
    modelEl.innerHTML = `<p class="macbook-error">Could not load the 3D model. Check the file path.</p>`;
  }
}

loadModel();

// Subtle idle rotation handled by GSAP (see below)

// Resize
window.addEventListener("resize", () => {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

/* --------------------------------------------------------------------------
 * GSAP animation loop
 * -------------------------------------------------------------------------- */

gsap.registerEffect({
  name: "idleRotate",
  effects(target) {
    const rot = gsap.timeline({ repeat: -1, repeatRefresh: true });
    rot.to(target.rotation, { y: target.rotation.y + 0.08, duration: 6, ease: "power1.out" });
    return () => {};
  },
});

// Idle rotate the model once it is ready
function startIdleRotate() {
  if (!model) return;
  gsap.fromTo(model.rotation,
    { y: model.rotation.y },
    { y: model.rotation.y + 0.12, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true, onStart: () => ((modelEl.style.animationPlayState = "running")) });
  gsap.set(model, { rotation: { y: model.rotation.y - 0.35 } });
}

let paused = false;

function togglePause() {
  paused = !paused;
  const label = paused ? "Resume animation" : "Pause animation";
  btnToggle.textContent = label;
  if (model) {
    gsap.globalTimeline.paused(paused);
  }
}

function resetScene() {
  togglePause();
  if (model) {
    gsap.set(model.rotation, { y: -0.35 });
  }
  btnToggle.textContent = "Pause animation";
}

btnToggle.addEventListener("click", togglePause);
btnReset.addEventListener("click", resetScene);

/* --------------------------------------------------------------------------
 * Scroll-driven reveal (GSAP ScrollTrigger)
 * -------------------------------------------------------------------------- */

const revealEls = document.querySelectorAll(".fade-up, .scale-in");

function checkReveal() {
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const vHeight = window.innerHeight;
    if (rect.top < vHeight - 120) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", checkReveal);
window.addEventListener("resize", checkReveal);
checkReveal();

// Smooth-scroll for anchor links (native behavior is fine, but we ensure no jump)
document.querySelectorAll("a[href^='#']").forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#" || id === "") return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* --------------------------------------------------------------------------
 * Contact form (notice-only)
 * -------------------------------------------------------------------------- */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim() || "there";
  formNote.textContent = `Thanks, ${name} — your message is in. We'll reply soon.`;
  form.reset();
  setTimeout(() => { formNote.textContent = ""; }, 6000);
});

/* --------------------------------------------------------------------------
 * Header shadow on scroll
 * -------------------------------------------------------------------------- */

const header = document.querySelector(".site-header");
let lastScrolled = 0;

window.addEventListener("scroll", () => {
  const now = performance.now();
  if (now - lastScrolled > 80) {
    const pkg = window.scrollY;
    header.style.boxShadow = pkg > 8 ? "0 4px 20px rgba(0,0,0,0.06)" : "none";
    lastScrolled = now;
  }
});
