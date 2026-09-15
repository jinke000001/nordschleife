import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createRoadGeometry, roadPoint } from './karussell-geometry.js';

export function createKarussellScene(host, onError) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x11171b, 0);
  renderer.domElement.setAttribute('aria-label', 'Karussell 内倾弯三维结构示意；可使用下方按钮调整视角');
  renderer.domElement.setAttribute('role', 'img');
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-40, 40, 32, -32, .1, 300);
  camera.position.set(38, 36, 44);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 3);
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.minPolarAngle = .02;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minZoom = .65;
  controls.maxZoom = 2.5;
  controls.update();

  let disposed = false;
  let visible = true;
  let frame = 0;
  let tween = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const render = () => {
    if (disposed || !visible || document.hidden || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!disposed && visible && !document.hidden) renderer.render(scene, camera);
    });
  };
  const stopTween = () => { cancelAnimationFrame(tween); tween = 0; };
  const mesh = (geometry, color, roughness = .9) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness: .05 });
    const object = new THREE.Mesh(geometry, material);
    scene.add(object);
    return object;
  };
  scene.add(new THREE.HemisphereLight(0xe5f0ff, 0x34332c, 2.6));
  const sun = new THREE.DirectionalLight(0xfff2da, 3.2);
  sun.position.set(-20, 45, 12);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xb4d7ee, 1.5);
  rim.position.set(30, 16, -25);
  scene.add(rim);

  try {
    // A cutaway exhibit plinth, deliberately not a reconstruction of the surrounding terrain.
    const base = mesh(new THREE.CylinderGeometry(28, 28, 1.1, 96), 0x303c3c);
    base.position.set(0, -3.2, 2);
    const upperBase = mesh(new THREE.CylinderGeometry(27.8, 27.8, .2, 96), 0x3b4843);
    upperBase.position.set(0, -2.58, 2);
    mesh(createRoadGeometry(17, 23), 0x454b4e);
    // Individual slabs make the material boundary legible without textures or downloads.
    for (let i = 0; i < 46; i++) {
      mesh(createRoadGeometry(12, 17, i / 46 + .001, (i + 1) / 46 - .001, 4), i % 3 === 0 ? 0xc8c6b9 : 0xb6b6ac);
    }
    // Structural side faces connect the road edge to the model base.
    for (const radius of [12, 23]) {
      const positions = []; const indices = [];
      for (let i = 0; i <= 100; i++) {
        const p = roadPoint(i / 100, radius);
        positions.push(...p, p[0], -2.5, p[2]);
        if (i < 100) { const a = i * 2; indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      g.setIndex(indices); g.computeVertexNormals();
      const wall = mesh(g, 0x656d67); wall.material.side = THREE.DoubleSide;
    }
    // Thin edge markings follow the exact same surface function as the road.
    const line = (radius, color, offset = .045) => {
      const points = Array.from({ length: 101 }, (_, i) => {
        const p = roadPoint(i / 100, radius); p[1] += offset; return new THREE.Vector3(...p);
      });
      const object = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color }));
      scene.add(object);
    };
    line(22.3, 0xccc9bb); line(12, 0xdad5bf); line(17, 0xe2d8c5);
    // The selected red marker refers to a reading point, not a vehicle or a racing line.
    const marker = mesh(new THREE.SphereGeometry(.65, 16, 10), 0xff3c38, .5);
    const stem = mesh(new THREE.CylinderGeometry(.08, .08, 3, 8), 0xeb5147);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, .065, 6, 32), new THREE.MeshBasicMaterial({ color: 0xf57563 }));
    ring.rotation.x = Math.PI / 2; scene.add(ring);

    const focus = (index) => {
      const point = roadPoint([.08, .5, .92][index] ?? .5, 14.5);
      marker.position.set(point[0], point[1] + 3.2, point[2]);
      stem.position.set(point[0], point[1] + 1.6, point[2]);
      ring.position.set(point[0], point[1] + .2, point[2]);
      render();
    };
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      const halfH = 28 * Math.max(1, 1 / aspect);
      camera.left = -halfH * aspect; camera.right = halfH * aspect;
      camera.top = halfH; camera.bottom = -halfH;
      camera.updateProjectionMatrix(); renderer.setSize(width, height); render();
    };
    const setView = (view, immediate = false) => {
      stopTween();
      const target = new THREE.Vector3(...({ overview: [38, 36, 44], top: [0, 70, 3.1], side: [0, 10, 70] }[view] || [38, 36, 44]));
      const start = camera.position.clone();
      const initialZoom = camera.zoom;
      const started = performance.now();
      const step = () => {
        if (disposed || !visible || document.hidden) { tween = 0; return; }
        const progress = immediate || reduceMotion.matches ? 1 : Math.min(1, (performance.now() - started) / 420);
        const ease = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(start, target, ease);
        camera.zoom = initialZoom + (1 - initialZoom) * ease;
        camera.updateProjectionMatrix(); controls.update(); render();
        tween = progress < 1 ? requestAnimationFrame(step) : 0;
      };
      step();
    };
    const visibility = () => {
      if (document.hidden) { stopTween(); cancelAnimationFrame(frame); frame = 0; }
      else render();
    };
    const lost = (event) => { event.preventDefault(); stopTween(); onError(); };
    controls.addEventListener('change', render);
    controls.addEventListener('start', stopTween);
    renderer.domElement.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', visibility);
    host.append(renderer.domElement);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { stopTween(); cancelAnimationFrame(frame); frame = 0; } else render();
    });
    intersection.observe(host.parentElement);
    resize(); focus(1);
    return {
      focus,
      setView,
      zoom(factor) { stopTween(); camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, .65, 2.5); camera.updateProjectionMatrix(); render(); },
      rotate(direction) {
        stopTween();
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), direction * Math.PI / 10);
        camera.position.copy(controls.target).add(offset); controls.update(); render();
      },
      dispose() {
        if (disposed) return;
        disposed = true; stopTween(); cancelAnimationFrame(frame);
        resizeObserver.disconnect(); intersection.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        controls.dispose();
        disposeScene();
        renderer.domElement.remove();
      },
    };
  } catch (error) {
    controls.dispose(); disposeScene(); throw error;
  }
  function disposeScene() {
    scene.traverse(object => {
      object.geometry?.dispose();
      if (object.material) for (const material of [object.material].flat()) material.dispose();
    });
    renderer.dispose();
  }
}
