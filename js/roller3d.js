/**
 * RollPack — Interactive 3D Model
 * Built with Three.js r160
 * Creates two instances: hero canvas + specs canvas
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ─── Constants ──────────────────────────────────────────────────────────────
const ROLLER_RADIUS  = 7.6;
const ROLLER_LENGTH  = 91;
const RIDGE_COUNT    = 14;
const RIDGE_RADIUS   = 0.85;
const CAP_THICKNESS  = 2.0;

const C_CHARCOAL  = 0x2e4a6e;  // was 0x1c2535 — lightened for visibility on dark bg
const C_DARK      = 0x1e3350;  // was 0x141d2b — ridge slightly darker than body
const C_BLUE      = 0x0066ff;
const C_SILVER    = 0xa8b4c4;
const C_BLACK     = 0x182840;  // was 0x0a0f18 — strap visible but still dark
const C_INTERIOR  = 0x1e3a5f;

// ─── Scene builder ──────────────────────────────────────────────────────────
function buildScene() {
  const scene = new THREE.Scene();
  scene.background = null;

  // Lighting — boosted to ensure model is visible against dark background
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));  // was 0.5

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);  // was 1.8
  keyLight.position.set(40, 80, 60);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x6699ff, 1.2);  // was 0.8
  fillLight.position.set(-60, 20, -40);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.9);  // was 0.6
  rimLight.position.set(0, -40, -60);
  scene.add(rimLight);

  const pointAccent = new THREE.PointLight(C_BLUE, 1.8, 300);  // was 1.2, 200
  pointAccent.position.set(0, 60, 60);
  scene.add(pointAccent);

  // Materials
  const matRoller = new THREE.MeshStandardMaterial({ color: C_CHARCOAL, roughness: 0.82, metalness: 0.05 });
  const matCap    = new THREE.MeshStandardMaterial({ color: C_BLUE,     roughness: 0.55, metalness: 0.1  });
  const matRidge  = new THREE.MeshStandardMaterial({ color: C_DARK,     roughness: 0.9,  metalness: 0.0  });
  const matZipper = new THREE.MeshStandardMaterial({ color: C_SILVER,   roughness: 0.3,  metalness: 0.8  });
  const matPull   = new THREE.MeshStandardMaterial({ color: C_SILVER,   roughness: 0.25, metalness: 0.9  });
  const matStrap  = new THREE.MeshStandardMaterial({ color: C_BLACK,    roughness: 0.9,  metalness: 0.0  });
  const matHW     = new THREE.MeshStandardMaterial({ color: C_SILVER,   roughness: 0.2,  metalness: 0.95 });

  // Bug fix #2: transparent:true is required for opacity to work
  const matInterior = new THREE.MeshStandardMaterial({
    color: C_INTERIOR,
    roughness: 0.7,
    metalness: 0.0,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0,
  });

  const root = new THREE.Group();
  scene.add(root);

  // Main cylinder body (open-ended so interior is visible)
  const bodyGeo = new THREE.CylinderGeometry(ROLLER_RADIUS, ROLLER_RADIUS, ROLLER_LENGTH, 64, 4, true);
  const body = new THREE.Mesh(bodyGeo, matRoller);
  body.rotation.x = Math.PI / 2;
  root.add(body);

  // Interior hollow
  const interiorGeo = new THREE.CylinderGeometry(
    ROLLER_RADIUS - 1.2, ROLLER_RADIUS - 1.2, ROLLER_LENGTH - 2, 64, 2, true
  );
  const interior = new THREE.Mesh(interiorGeo, matInterior);
  interior.rotation.x = Math.PI / 2;
  interior.visible = false;
  interior.name = 'interior';
  root.add(interior);

  // Foam texture ridges
  for (let i = 0; i < RIDGE_COUNT; i++) {
    const t = (i / (RIDGE_COUNT - 1)) - 0.5;
    const z = t * (ROLLER_LENGTH - 8);
    const ridge = new THREE.Mesh(
      new THREE.TorusGeometry(ROLLER_RADIUS + 0.05, RIDGE_RADIUS, 10, 64),
      matRidge
    );
    ridge.rotation.x = Math.PI / 2;
    ridge.position.z = z;
    root.add(ridge);
  }

  // End caps
  const capGeo = new THREE.CylinderGeometry(ROLLER_RADIUS, ROLLER_RADIUS, CAP_THICKNESS, 64);
  const capFront = new THREE.Mesh(capGeo, matCap);
  capFront.rotation.x = Math.PI / 2;
  capFront.position.z = ROLLER_LENGTH / 2 + CAP_THICKNESS / 2;
  const capBack = new THREE.Mesh(capGeo, matCap);
  capBack.rotation.x = Math.PI / 2;
  capBack.position.z = -(ROLLER_LENGTH / 2 + CAP_THICKNESS / 2);
  root.add(capFront, capBack);

  // Decorative cap rings
  for (const z of [ROLLER_LENGTH / 2 + CAP_THICKNESS + 0.5, -(ROLLER_LENGTH / 2 + CAP_THICKNESS + 0.5)]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(ROLLER_RADIUS + 0.3, 0.4, 8, 64), matCap);
    ring.rotation.x = Math.PI / 2;
    ring.position.z = z;
    root.add(ring);
  }

  // Zipper seam tube
  const zipPts = [];
  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) - 0.5;
    zipPts.push(new THREE.Vector3(
      ROLLER_RADIUS * Math.cos(Math.PI * 0.07),
      ROLLER_RADIUS * Math.sin(Math.PI * 0.07),
      t * (ROLLER_LENGTH - 4)
    ));
  }
  root.add(new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(zipPts), 60, 0.3, 8, false),
    matZipper
  ));

  // Zipper pull tabs
  for (const side of [-1, 1]) {
    const grp = new THREE.Group();
    grp.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.8), matPull));
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), matPull);
    ball.position.y = -0.8;
    grp.add(ball);
    grp.position.set(
      ROLLER_RADIUS * Math.cos(Math.PI * 0.07),
      ROLLER_RADIUS * Math.sin(Math.PI * 0.07) + 1.5,
      side * (ROLLER_LENGTH / 2 - 5)
    );
    grp.rotation.z = -Math.PI * 0.07;
    root.add(grp);
  }

  // Shoulder straps
  const strapGroup = new THREE.Group();
  strapGroup.name = 'straps';

  function makeStrap(ox) {
    const pts = [
      new THREE.Vector3(ox, ROLLER_RADIUS * 0.7,  -ROLLER_LENGTH * 0.35),
      new THREE.Vector3(ox, ROLLER_RADIUS * 1.6,  -ROLLER_LENGTH * 0.15),
      new THREE.Vector3(ox, ROLLER_RADIUS * 1.8,   ROLLER_LENGTH * 0.05),
      new THREE.Vector3(ox, ROLLER_RADIUS * 1.6,   ROLLER_LENGTH * 0.20),
      new THREE.Vector3(ox, ROLLER_RADIUS * 0.7,   ROLLER_LENGTH * 0.38),
    ];
    return new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.65, 8, false),
      matStrap
    );
  }

  strapGroup.add(makeStrap(-3.5));
  strapGroup.add(makeStrap(3.5));

  // Chest buckle
  const buckle = new THREE.Mesh(
    new THREE.BoxGeometry(7.5, 1.4, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x9eaabb, roughness: 0.5, metalness: 0.2 })
  );
  buckle.position.set(0, ROLLER_RADIUS * 1.8, ROLLER_LENGTH * 0.05);
  strapGroup.add(buckle);

  // D-rings
  const dringGeo = new THREE.TorusGeometry(1.4, 0.35, 6, 20);
  for (const [z, side] of [
    [-ROLLER_LENGTH * 0.35, -1], [-ROLLER_LENGTH * 0.35, 1],
    [ ROLLER_LENGTH * 0.38, -1], [ ROLLER_LENGTH * 0.38, 1],
  ]) {
    const dr = new THREE.Mesh(dringGeo, matHW);
    dr.position.set(side * 3.5, ROLLER_RADIUS * 0.9, z);
    dr.rotation.x = Math.PI / 2;
    strapGroup.add(dr);
  }

  root.add(strapGroup);

  return { scene, root, interior, strapGroup };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  return renderer;
}

function createCamera(w, h) {
  const cam = new THREE.PerspectiveCamera(42, w / h || 1, 0.1, 1000);
  cam.position.set(60, 40, 80);
  cam.lookAt(0, 0, 0);
  return cam;
}

function createControls(camera, domElement) {
  const ctrl = new OrbitControls(camera, domElement);
  ctrl.enableDamping  = true;
  ctrl.dampingFactor  = 0.08;
  ctrl.autoRotate     = true;
  ctrl.autoRotateSpeed = 0.8;
  ctrl.enablePan      = false;
  ctrl.minDistance    = 30;
  ctrl.maxDistance    = 200;
  ctrl.maxPolarAngle  = Math.PI * 0.75;
  ctrl.minPolarAngle  = Math.PI * 0.15;
  domElement.addEventListener('pointerdown', () => { ctrl.autoRotate = false; }, { passive: true });
  return ctrl;
}

// ─── Instance setup ───────────────────────────────────────────────────────────
function setupInstance(canvasId, containerEl) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !containerEl) return null;

  // Bug fix #1: read dimensions after layout is complete
  const w = containerEl.offsetWidth  || 400;
  const h = containerEl.offsetHeight || 400;

  const renderer = createRenderer(canvas);
  renderer.setSize(w, h, false); // false = don't overwrite CSS width/height

  const camera   = createCamera(w, h);
  const controls = createControls(camera, canvas);

  const { scene, root, interior, strapGroup } = buildScene();

  let bagOpen      = false;
  let openProgress = 0;
  let firstFrame   = false;

  // Bug fix #1: ResizeObserver on the container (more reliable than window.resize)
  const ro = new ResizeObserver(() => {
    const W = containerEl.offsetWidth;
    const H = containerEl.offsetHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  });
  ro.observe(containerEl);

  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);
    controls.update();

    if (bagOpen && openProgress < 1)      openProgress = Math.min(1, openProgress + 0.025);
    else if (!bagOpen && openProgress > 0) openProgress = Math.max(0, openProgress - 0.025);

    // Bug fix #2: transparent:true now set on material so opacity works
    if (openProgress > 0.05) {
      interior.visible = true;
      interior.material.opacity = openProgress;
    } else {
      interior.visible = false;
    }

    renderer.render(scene, camera);

    // Hide SVG fallback only after first successful render frame
    if (!firstFrame) {
      firstFrame = true;
      const fallback = containerEl.querySelector('.canvas-fallback');
      if (fallback) fallback.style.display = 'none';
    }
  }
  animate();

  return {
    renderer, camera, controls, scene, root, interior, strapGroup,
    get bagOpen() { return bagOpen; },
    toggleBag() { bagOpen = !bagOpen; return bagOpen; },
    destroy() { cancelAnimationFrame(rafId); ro.disconnect(); renderer.dispose(); },
  };
}

// ─── Init — deferred until after first paint ─────────────────────────────────
function init() {
  // Check WebGL support
  const testCanvas = document.createElement('canvas');
  const hasWebGL = !!(testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'));

  if (!hasWebGL) {
    // Leave the SVG fallbacks visible, nothing more to do
    console.warn('RollPack 3D: WebGL not available — showing static illustrations');
    return;
  }

  const heroContainer  = document.getElementById('canvas-hero-container');
  const specsContainer = document.getElementById('canvas-specs-container');

  const heroInstance  = setupInstance('canvas-hero',  heroContainer);
  const specsInstance = setupInstance('canvas-specs', specsContainer); // eslint-disable-line no-unused-vars

  if (!heroInstance) return;

  const btnToggle = document.getElementById('btnToggleBag');
  const modelLabel = document.getElementById('modelLabel');

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      const isOpen = heroInstance.toggleBag();
      btnToggle.textContent = isOpen ? 'Close Bag' : 'Open Bag';
      if (modelLabel) modelLabel.textContent = isOpen ? 'Bag Mode — 8L Storage' : 'Foam Roller Mode';
    });
  }
}

// Bug fix #1: defer init past layout — rAF ensures paint cycle, setTimeout gives
// the browser an extra tick to calculate grid/flex dimensions
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => setTimeout(init, 60));
});
