/**
 * RollPack — Interactive 3D Model
 * Built with Three.js r160
 * Creates two instances: hero canvas + specs canvas
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ─── Constants ──────────────────────────────────────────────────────────────
const ROLLER_RADIUS  = 7.6;   // ~15cm diameter → scale units
const ROLLER_LENGTH  = 91;    // ~91cm actual length → scale units
const RIDGE_COUNT    = 14;    // foam texture ridges
const RIDGE_RADIUS   = 0.85;
const CAP_THICKNESS  = 2.0;

// Colors
const C_CHARCOAL  = 0x1c2535;
const C_DARK      = 0x141d2b;
const C_BLUE      = 0x0066ff;
const C_CYAN      = 0x00d4ff;
const C_SILVER    = 0xa8b4c4;
const C_BLACK     = 0x0a0f18;
const C_INTERIOR  = 0x1e3a5f;

// ─── Scene builder ──────────────────────────────────────────────────────────
function buildScene() {
  const scene = new THREE.Scene();
  scene.background = null;

  // --- Lighting ---
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(40, 80, 60);
  keyLight.castShadow = false;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.8);
  fillLight.position.set(-60, 20, -40);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.6);
  rimLight.position.set(0, -40, -60);
  scene.add(rimLight);

  const pointAccent = new THREE.PointLight(C_BLUE, 1.2, 200);
  pointAccent.position.set(0, 60, 60);
  scene.add(pointAccent);

  // --- Materials ---
  const matRoller = new THREE.MeshStandardMaterial({
    color: C_CHARCOAL,
    roughness: 0.82,
    metalness: 0.05,
  });

  const matCap = new THREE.MeshStandardMaterial({
    color: C_BLUE,
    roughness: 0.55,
    metalness: 0.1,
  });

  const matRidge = new THREE.MeshStandardMaterial({
    color: C_DARK,
    roughness: 0.9,
    metalness: 0.0,
  });

  const matZipper = new THREE.MeshStandardMaterial({
    color: C_SILVER,
    roughness: 0.3,
    metalness: 0.8,
  });

  const matPull = new THREE.MeshStandardMaterial({
    color: C_SILVER,
    roughness: 0.25,
    metalness: 0.9,
  });

  const matStrap = new THREE.MeshStandardMaterial({
    color: C_BLACK,
    roughness: 0.9,
    metalness: 0.0,
  });

  const matHardware = new THREE.MeshStandardMaterial({
    color: C_SILVER,
    roughness: 0.2,
    metalness: 0.95,
  });

  const matInterior = new THREE.MeshStandardMaterial({
    color: C_INTERIOR,
    roughness: 0.7,
    metalness: 0.0,
    side: THREE.BackSide,
  });

  // ── Root group (everything rotates together)
  const root = new THREE.Group();
  scene.add(root);

  // ── Main cylinder (roller body) ──────────────────────────────────────────
  const bodyGeo = new THREE.CylinderGeometry(
    ROLLER_RADIUS, ROLLER_RADIUS, ROLLER_LENGTH, 64, 4, true
  );
  const body = new THREE.Mesh(bodyGeo, matRoller);
  body.rotation.x = Math.PI / 2; // orient along Z axis
  root.add(body);

  // ── Interior hollow (shown when bag is open) ──────────────────────────────
  const interiorGeo = new THREE.CylinderGeometry(
    ROLLER_RADIUS - 1.2, ROLLER_RADIUS - 1.2, ROLLER_LENGTH - 2, 64, 2, true
  );
  const interior = new THREE.Mesh(interiorGeo, matInterior);
  interior.rotation.x = Math.PI / 2;
  interior.visible = false;
  interior.name = 'interior';
  root.add(interior);

  // ── Foam texture ridges ───────────────────────────────────────────────────
  for (let i = 0; i < RIDGE_COUNT; i++) {
    const t = (i / (RIDGE_COUNT - 1)) - 0.5; // −0.5 to 0.5
    const z = t * (ROLLER_LENGTH - 8);
    const ridgeGeo = new THREE.TorusGeometry(ROLLER_RADIUS + 0.05, RIDGE_RADIUS, 10, 64);
    const ridge = new THREE.Mesh(ridgeGeo, matRidge);
    ridge.rotation.x = Math.PI / 2;
    ridge.position.z = z;
    root.add(ridge);
  }

  // ── End caps ─────────────────────────────────────────────────────────────
  const capGeo = new THREE.CylinderGeometry(ROLLER_RADIUS, ROLLER_RADIUS, CAP_THICKNESS, 64);

  const capFront = new THREE.Mesh(capGeo, matCap);
  capFront.rotation.x = Math.PI / 2;
  capFront.position.z = ROLLER_LENGTH / 2 + CAP_THICKNESS / 2;

  const capBack = new THREE.Mesh(capGeo, matCap);
  capBack.rotation.x = Math.PI / 2;
  capBack.position.z = -(ROLLER_LENGTH / 2 + CAP_THICKNESS / 2);

  root.add(capFront, capBack);

  // End cap rings (decorative)
  for (const z of [ROLLER_LENGTH / 2 + CAP_THICKNESS + 0.5, -(ROLLER_LENGTH / 2 + CAP_THICKNESS + 0.5)]) {
    const ringGeo = new THREE.TorusGeometry(ROLLER_RADIUS + 0.3, 0.4, 8, 64);
    const ring = new THREE.Mesh(ringGeo, matCap);
    ring.rotation.x = Math.PI / 2;
    ring.position.z = z;
    root.add(ring);
  }

  // ── Zipper seam ───────────────────────────────────────────────────────────
  // A thin tube running the full length along the top
  const zipperPoints = [];
  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) - 0.5;
    const z = t * (ROLLER_LENGTH - 4);
    const x = ROLLER_RADIUS * Math.cos(Math.PI * 0.07);
    const y = ROLLER_RADIUS * Math.sin(Math.PI * 0.07);
    zipperPoints.push(new THREE.Vector3(x, y, z));
  }
  const zipperCurve = new THREE.CatmullRomCurve3(zipperPoints);
  const zipperTubeGeo = new THREE.TubeGeometry(zipperCurve, 60, 0.3, 8, false);
  const zipperSeam = new THREE.Mesh(zipperTubeGeo, matZipper);
  root.add(zipperSeam);

  // Zipper pull tabs (at each end)
  const pullGeo = new THREE.BoxGeometry(1.8, 1.2, 0.8);
  const pullRoundGeo = new THREE.SphereGeometry(0.5, 8, 8);

  for (const side of [-1, 1]) {
    const pullGroup = new THREE.Group();

    const pullBase = new THREE.Mesh(pullGeo, matPull);
    const pullRound = new THREE.Mesh(pullRoundGeo, matPull);
    pullRound.position.y = -0.8;
    pullGroup.add(pullBase, pullRound);

    const x = ROLLER_RADIUS * Math.cos(Math.PI * 0.07);
    const y = ROLLER_RADIUS * Math.sin(Math.PI * 0.07);
    pullGroup.position.set(x, y + 1.5, side * (ROLLER_LENGTH / 2 - 5));
    pullGroup.rotation.z = -Math.PI * 0.07;
    root.add(pullGroup);
  }

  // ── Shoulder straps ───────────────────────────────────────────────────────
  // Left strap
  const strapGroup = new THREE.Group();
  strapGroup.name = 'straps';

  function makeStrap(offsetX) {
    const pts = [];
    // Attachment top
    pts.push(new THREE.Vector3(offsetX, ROLLER_RADIUS * 0.7, -ROLLER_LENGTH * 0.35));
    // Loop over top
    pts.push(new THREE.Vector3(offsetX, ROLLER_RADIUS * 1.6, -ROLLER_LENGTH * 0.15));
    pts.push(new THREE.Vector3(offsetX, ROLLER_RADIUS * 1.8, ROLLER_LENGTH * 0.05));
    pts.push(new THREE.Vector3(offsetX, ROLLER_RADIUS * 1.6, ROLLER_LENGTH * 0.2));
    // Down attachment bottom
    pts.push(new THREE.Vector3(offsetX, ROLLER_RADIUS * 0.7, ROLLER_LENGTH * 0.38));

    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 24, 0.65, 8, false);
    return new THREE.Mesh(geo, matStrap);
  }

  strapGroup.add(makeStrap(-3.5));
  strapGroup.add(makeStrap(3.5));

  // Chest buckle connector
  const buckleGeo = new THREE.BoxGeometry(7.5, 1.4, 0.8);
  const buckle = new THREE.Mesh(buckleGeo, new THREE.MeshStandardMaterial({
    color: 0x9eaabb, roughness: 0.5, metalness: 0.2
  }));
  buckle.position.set(0, ROLLER_RADIUS * 1.8, ROLLER_LENGTH * 0.05);
  strapGroup.add(buckle);

  // D-rings (strap attachments)
  const dringGeo = new THREE.TorusGeometry(1.4, 0.35, 6, 20);
  for (const [z, side] of [
    [-ROLLER_LENGTH * 0.35, -1],
    [-ROLLER_LENGTH * 0.35,  1],
    [ ROLLER_LENGTH * 0.38, -1],
    [ ROLLER_LENGTH * 0.38,  1],
  ]) {
    const x = side * 3.5;
    const dring = new THREE.Mesh(dringGeo, matHardware);
    dring.position.set(x, ROLLER_RADIUS * 0.9, z);
    dring.rotation.x = Math.PI / 2;
    strapGroup.add(dring);
  }

  root.add(strapGroup);

  // ── Bag opening halves (for animation) ────────────────────────────────────
  // Top half — rotates open
  const topHalfGeo = new THREE.CylinderGeometry(
    ROLLER_RADIUS + 0.08, ROLLER_RADIUS + 0.08, ROLLER_LENGTH + 0.5, 64, 1,
    true, 0, Math.PI
  );
  const topHalf = new THREE.Mesh(topHalfGeo, new THREE.MeshStandardMaterial({
    color: C_CHARCOAL,
    roughness: 0.82,
    metalness: 0.05,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
  }));
  topHalf.rotation.x = Math.PI / 2;
  topHalf.name = 'topHalf';
  root.add(topHalf);

  return { scene, root, interior, strapGroup, topHalf };
}

// ─── Renderer factory ────────────────────────────────────────────────────────
function createRenderer(canvas, alpha = true) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  return renderer;
}

// ─── Camera factory ──────────────────────────────────────────────────────────
function createCamera(aspect) {
  const cam = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
  cam.position.set(60, 40, 80);
  cam.lookAt(0, 0, 0);
  return cam;
}

// ─── Controls factory ────────────────────────────────────────────────────────
function createControls(camera, domElement, autoRotate = true) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.8;
  controls.enablePan = false;
  controls.minDistance = 30;
  controls.maxDistance = 200;
  controls.maxPolarAngle = Math.PI * 0.75;
  controls.minPolarAngle = Math.PI * 0.15;
  // Stop auto-rotate on user interaction
  domElement.addEventListener('pointerdown', () => { controls.autoRotate = false; });
  return controls;
}

// ─── Main instance setup ─────────────────────────────────────────────────────
function setupInstance(canvasId, containerEl, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !containerEl) return null;

  const w = containerEl.clientWidth;
  const h = containerEl.clientHeight;

  const renderer = createRenderer(canvas);
  renderer.setSize(w, h);

  const camera = createCamera(w / h);
  const controls = createControls(camera, canvas, opts.autoRotate !== false);

  const { scene, root, interior, strapGroup, topHalf } = buildScene();

  // State
  let bagOpen = false;
  let openProgress = 0; // 0 = closed, 1 = open

  // Resize handler
  function onResize() {
    const W = containerEl.clientWidth;
    const H = containerEl.clientHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  // Animation loop
  let rafId;
  function animate() {
    rafId = requestAnimationFrame(animate);
    controls.update();

    // Animate bag open/close
    if (bagOpen && openProgress < 1) {
      openProgress = Math.min(1, openProgress + 0.025);
    } else if (!bagOpen && openProgress > 0) {
      openProgress = Math.max(0, openProgress - 0.025);
    }

    // Show/hide interior based on progress
    if (openProgress > 0.1) {
      interior.visible = true;
      interior.material.opacity = openProgress;
    } else {
      interior.visible = false;
    }

    renderer.render(scene, camera);
  }
  animate();

  return {
    renderer, camera, controls, scene, root, interior, strapGroup,
    get bagOpen() { return bagOpen; },
    toggleBag() {
      bagOpen = !bagOpen;
      return bagOpen;
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    }
  };
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Hero instance
  const heroContainer = document.getElementById('canvas-hero-container');
  const heroInstance = setupInstance('canvas-hero', heroContainer, { autoRotate: true });

  // Specs instance (smaller, no controls shown)
  const specsContainer = document.getElementById('canvas-specs-container');
  const specsInstance  = setupInstance('canvas-specs', specsContainer, { autoRotate: true });

  if (!heroInstance) {
    console.warn('RollPack 3D: Hero canvas not found');
    return;
  }

  // Open/Close bag button
  const btnToggle = document.getElementById('btnToggleBag');
  const modelLabel = document.getElementById('modelLabel');

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      const isOpen = heroInstance.toggleBag();
      btnToggle.textContent = isOpen ? 'Close Bag' : 'Open Bag';
      if (modelLabel) {
        modelLabel.textContent = isOpen ? 'Bag Mode — 8L Storage' : 'Foam Roller Mode';
        modelLabel.style.color = isOpen ? 'var(--highlight)' : 'var(--highlight)';
      }
    });
  }

  // Sync specs instance bag state with hero (for demo purposes)
  // Specs viewer always stays in roller mode
});
