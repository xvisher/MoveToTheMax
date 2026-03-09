/**
 * GymRollerBag — Interactive 3D Viewer
 *
 * Renders a procedural Three.js model of the GymRollerBag that exactly
 * mirrors the OpenSCAD design geometry and proportions.
 *
 * Usage:
 *   import { GymRollerViewer } from './viewer3d.js';
 *   const viewer = new GymRollerViewer('container-element-id');
 *   viewer.destroy(); // when done
 *
 * The class is self-contained: it manages its own renderer, scene,
 * camera, controls, resize handling, and animation loop.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class GymRollerViewer {
  /**
   * @param {string} containerId - ID of the DOM element to render into.
   *   The container MUST have an explicit height set via CSS.
   */
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`GymRollerViewer: container #${containerId} not found`);
      return;
    }

    this._destroyed = false;
    this._resumeTimeout = null;

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initLights();
    this._buildModel();
    this._initControls();
    this._initResize();
    this._animate();
  }

  // ---------------------------------------------------------------------------
  // Renderer
  // ---------------------------------------------------------------------------

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,           // transparent background — CSS gradient shows through
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    // Fix iOS Safari touch event propagation
    this.renderer.domElement.style.touchAction = 'none';

    this.container.appendChild(this.renderer.domElement);
  }

  // ---------------------------------------------------------------------------
  // Scene
  // ---------------------------------------------------------------------------

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent — CSS handles bg
  }

  // ---------------------------------------------------------------------------
  // Camera
  // ---------------------------------------------------------------------------

  _initCamera() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(42, w / h, 1, 3000);
    this.camera.position.set(340, 160, 380);
    this.camera.lookAt(0, 0, 0);
  }

  // ---------------------------------------------------------------------------
  // Lights
  // ---------------------------------------------------------------------------

  _initLights() {
    // Ambient fill — keeps shadows from going pure black
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    // Key light — warm, from upper right, casts shadows
    const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.0);
    keyLight.position.set(300, 450, 250);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width  = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far  = 1500;
    keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -400;
    keyLight.shadow.camera.right = keyLight.shadow.camera.top  =  400;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    // Rim light — orange accent (matches CSS --accent)
    const rimLight = new THREE.DirectionalLight(0xff6600, 0.7);
    rimLight.position.set(-350, 80, -220);
    this.scene.add(rimLight);

    // Fill light — soft blue from below, prevents harsh under-shadows
    const fillLight = new THREE.DirectionalLight(0x8898ff, 0.18);
    fillLight.position.set(0, -250, 120);
    this.scene.add(fillLight);

    // Point light — subtle warm glow near the zipper end cap
    const pointLight = new THREE.PointLight(0xffcc44, 0.5, 600);
    pointLight.position.set(0, 320, 100);
    this.scene.add(pointLight);
  }

  // ---------------------------------------------------------------------------
  // 3D Model — procedural geometry matching the OpenSCAD design
  // ---------------------------------------------------------------------------

  _buildModel() {
    // OpenSCAD dimensions (mm → used as Three.js units, scale 1:1)
    const L        = 457;   // body length
    const RO       = 76;    // outer radius  (152/2)
    const CAP      = 25;    // end cap height
    const GROOVE_S = 20;    // groove spacing
    const FN       = 64;    // radial segments for smooth circles

    // ---- Materials ----

    // EVA foam outer surface — near-black, rough
    const foamMat = new THREE.MeshStandardMaterial({
      color:     0x1a1a1a,
      roughness: 0.88,
      metalness: 0.0,
    });

    // End caps — dark, semi-matte
    const capMat = new THREE.MeshStandardMaterial({
      color:     0x141414,
      roughness: 0.45,
      metalness: 0.08,
    });

    // Accent — orange grooves & zipper ring
    const accentMat = new THREE.MeshStandardMaterial({
      color:             0xff6600,
      roughness:         0.25,
      metalness:         0.15,
      emissive:          0xff6600,
      emissiveIntensity: 0.12,
    });

    // Steel hardware — D-rings, strap bar
    const steelMat = new THREE.MeshStandardMaterial({
      color:     0xb0b0b8,
      roughness: 0.18,
      metalness: 0.92,
    });

    // Webbing — matte dark nylon strap
    const strapMat = new THREE.MeshStandardMaterial({
      color:     0x1e1e28,
      roughness: 0.90,
      metalness: 0.0,
    });

    // ---- Build the roller group ----
    this.rollerGroup = new THREE.Group();

    // — Body cylinder (open-ended: the EVA foam shell) —
    const bodyGeo = new THREE.CylinderGeometry(RO, RO, L, FN, 1, true);
    const body = new THREE.Mesh(bodyGeo, foamMat);
    body.castShadow = true;
    this.rollerGroup.add(body);

    // Body end discs (so it reads as a solid cylinder from outside)
    // Fixed end (bottom)
    const bottomDisc = new THREE.Mesh(
      new THREE.CircleGeometry(RO, FN),
      foamMat
    );
    bottomDisc.rotation.x = -Math.PI / 2;
    bottomDisc.position.y = -L / 2;
    this.rollerGroup.add(bottomDisc);

    // Removable end (top) — cap color shows
    const topDisc = new THREE.Mesh(
      new THREE.CircleGeometry(RO, FN),
      capMat
    );
    topDisc.rotation.x = Math.PI / 2;
    topDisc.position.y = L / 2;
    this.rollerGroup.add(topDisc);

    // — Surface grooves — accent-colored torus rings —
    for (let y = -L / 2 + GROOVE_S; y < L / 2 - GROOVE_S / 2; y += GROOVE_S) {
      const groove = new THREE.Mesh(
        new THREE.TorusGeometry(RO, 2, 6, FN),
        accentMat
      );
      groove.rotation.x = Math.PI / 2;
      groove.position.y = y;
      groove.castShadow = true;
      this.rollerGroup.add(groove);
    }

    // — Fixed end cap (bottom) —
    const fixedCap = new THREE.Mesh(
      new THREE.CylinderGeometry(RO, RO, CAP, FN),
      capMat
    );
    fixedCap.position.y = -(L / 2 + CAP / 2);
    fixedCap.castShadow = true;
    this.rollerGroup.add(fixedCap);

    // — Removable end cap (top) with knurl detail —
    const remCap = new THREE.Mesh(
      new THREE.CylinderGeometry(RO, RO, CAP, FN),
      capMat
    );
    remCap.position.y = L / 2 + CAP / 2;
    remCap.castShadow = true;
    this.rollerGroup.add(remCap);

    // Zipper ring on removable cap face (accent torus)
    const zipRing = new THREE.Mesh(
      new THREE.TorusGeometry(RO - 10, 3.5, 8, FN),
      accentMat
    );
    zipRing.rotation.x = Math.PI / 2;
    zipRing.position.y = L / 2 + CAP + 0.5;
    zipRing.castShadow = true;
    this.rollerGroup.add(zipRing);

    // Knurl edge detail on removable cap (small band)
    const knurlBand = new THREE.Mesh(
      new THREE.CylinderGeometry(RO + 1.5, RO + 1.5, CAP * 0.4, FN * 2),
      new THREE.MeshStandardMaterial({ color: 0x222230, roughness: 0.95, metalness: 0 })
    );
    knurlBand.position.y = L / 2 + CAP * 0.3;
    this.rollerGroup.add(knurlBand);

    // — D-ring hardware at each end —
    this._addDRingAssembly( -(L / 2 + CAP / 2), steelMat, strapMat);
    this._addDRingAssembly(   L / 2 + CAP / 2,  steelMat, strapMat);

    // Rotate so the roller lies horizontally (Z-axis aligned = looks right)
    this.rollerGroup.rotation.z = Math.PI / 2;
    this.scene.add(this.rollerGroup);

    // Subtle ground shadow plane (invisible, receives shadow only)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1200, 1200),
      new THREE.ShadowMaterial({ opacity: 0.18 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -(L / 2 + CAP + 40);
    ground.receiveShadow = true;
    // Note: ground inherits rollerGroup rotation so adjust:
    this.scene.add(ground);
  }

  /**
   * Adds a D-ring + strap bar assembly at a given Y position along
   * the roller group's local axis (before the group rotation).
   */
  _addDRingAssembly(y, steelMat, strapMat) {
    const group = new THREE.Group();

    // Strap bar (cross-bar through boss hole)
    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 58, 12),
      steelMat
    );
    bar.rotation.x = Math.PI / 2;
    group.add(bar);

    // D-ring (half torus)
    // Approximate D as a full torus; in real product it's a D shape
    const dRing = new THREE.Mesh(
      new THREE.TorusGeometry(20, 3.5, 10, 32, Math.PI),
      steelMat
    );
    dRing.rotation.y = Math.PI / 2;
    dRing.position.z = 29;  // offset outward from bar center
    group.add(dRing);

    // Short webbing loop connector (matte strap material)
    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(38, 5, 15),
      strapMat
    );
    strap.position.z = 20;
    group.add(strap);

    group.position.set(0, y, 76 + 12); // positioned at roller rim + offset
    this.rollerGroup.add(group);
  }

  // ---------------------------------------------------------------------------
  // Controls
  // ---------------------------------------------------------------------------

  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping   = true;
    this.controls.dampingFactor   = 0.07;
    this.controls.autoRotate      = true;
    this.controls.autoRotateSpeed = 1.0;
    this.controls.minDistance     = 200;
    this.controls.maxDistance     = 950;
    this.controls.maxPolarAngle   = Math.PI * 0.80; // prevent going fully below
    this.controls.enablePan       = false;           // keep product centered

    // Pause auto-rotate on user interaction; resume after 3s of idle
    this.controls.addEventListener('start', () => {
      this.controls.autoRotate = false;
      clearTimeout(this._resumeTimeout);
    });

    this.controls.addEventListener('end', () => {
      this._resumeTimeout = setTimeout(() => {
        if (!this._destroyed) this.controls.autoRotate = true;
      }, 3000);
    });
  }

  // ---------------------------------------------------------------------------
  // Resize handling
  // ---------------------------------------------------------------------------

  _initResize() {
    // ResizeObserver is more reliable than window.resize for container-level changes
    this._ro = new ResizeObserver(() => {
      if (this._destroyed) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w === 0 || h === 0) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
    this._ro.observe(this.container);
  }

  // ---------------------------------------------------------------------------
  // Animation loop
  // ---------------------------------------------------------------------------

  _animate() {
    if (this._destroyed) return;
    this._raf = requestAnimationFrame(() => this._animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // Hide the static SVG fallback after the first successful render frame
    if (!this._firstFrame) {
      this._firstFrame = true;
      const fallback = this.container.querySelector('.viewer-fallback');
      if (fallback) fallback.style.display = 'none';
    }
  }

  // ---------------------------------------------------------------------------
  // Pause / resume (called by IntersectionObserver in app.js for mobile perf)
  // ---------------------------------------------------------------------------

  pause() {
    this.renderer.setAnimationLoop(null);
    cancelAnimationFrame(this._raf);
  }

  resume() {
    if (!this._destroyed) this._animate();
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  destroy() {
    this._destroyed = true;
    clearTimeout(this._resumeTimeout);
    cancelAnimationFrame(this._raf);
    this._ro.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
