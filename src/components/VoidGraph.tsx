import { useEffect, useRef } from "react";
import * as THREE from "three";

// A living code graph: communities of symbols, call edges, and signals travelling along them.
// It's the page's single WebGL moment and a nod to codegraph.

const ACCENT = new THREE.Color("#34d399");
const DIM = new THREE.Color("#71717a");

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

export default function VoidGraph({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 11);
    const world = new THREE.Group();
    scene.add(world);

    // ── nodes: 5 communities scattered on a shell, a few "god nodes" per community ──
    const rand = rng(7);
    const COMMUNITIES = 5, PER = 28;
    const centers = Array.from({ length: COMMUNITIES }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / COMMUNITIES), theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return new THREE.Vector3().setFromSphericalCoords(3.1, phi, theta);
    });
    const nodes: { p: THREE.Vector3; c: number; hub: boolean }[] = [];
    centers.forEach((center, c) => {
      for (let i = 0; i < PER; i++) {
        const spread = i < 2 ? 0.25 : 1.35;
        const p = center.clone().add(new THREE.Vector3((rand() - 0.5) * 2, (rand() - 0.5) * 2, (rand() - 0.5) * 2).multiplyScalar(spread));
        nodes.push({ p, c, hub: i < 2 });
      }
    });

    const pos = new Float32Array(nodes.length * 3), col = new Float32Array(nodes.length * 3), size = new Float32Array(nodes.length);
    nodes.forEach((n, i) => {
      n.p.toArray(pos, i * 3);
      (n.hub ? ACCENT : DIM).toArray(col, i * 3);
      size[i] = n.hub ? 0.34 : 0.1 + rand() * 0.08;
    });
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    nodeGeo.setAttribute("size", new THREE.BufferAttribute(size, 1));
    const dotMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uScale: { value: 1 } },
      vertexShader: `attribute float size; attribute vec3 color; varying vec3 vColor; uniform float uScale;
        void main(){ vColor = color; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = size * uScale * (300. / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vColor;
        void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; float a = smoothstep(.5, .0, d); gl_FragColor = vec4(vColor, a * a * 1.4); }`,
    });
    world.add(new THREE.Points(nodeGeo, dotMat));

    // ── edges: dense inside a community, a few bridges between hubs ──
    const edges: [number, number][] = [];
    nodes.forEach((n, i) => {
      if (n.hub) return;
      const hub = n.c * PER + (rand() < 0.7 ? 0 : 1);
      edges.push([i, hub]);
      if (rand() < 0.45) edges.push([i, n.c * PER + 2 + Math.floor(rand() * (PER - 2))]);
    });
    for (let a = 0; a < COMMUNITIES; a++) for (let b = a + 1; b < COMMUNITIES; b++) if (rand() < 0.6) edges.push([a * PER, b * PER + 1]);
    const ePos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => { nodes[a].p.toArray(ePos, i * 6); nodes[b].p.toArray(ePos, i * 6 + 3); });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3));
    const edgeMat = new THREE.LineBasicMaterial({ color: "#a1a1aa", transparent: true, opacity: 0.13, depthWrite: false });
    world.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // ── signals: pulses travelling along random edges ──
    const PULSES = 26;
    const pulses = Array.from({ length: PULSES }, () => ({ e: Math.floor(rand() * edges.length), t: rand(), v: 0.25 + rand() * 0.5 }));
    const pPos = new Float32Array(PULSES * 3), pSize = new Float32Array(PULSES).fill(0.22), pCol = new Float32Array(PULSES * 3);
    for (let i = 0; i < PULSES; i++) ACCENT.toArray(pCol, i * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pulseGeo.setAttribute("size", new THREE.BufferAttribute(pSize, 1));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    world.add(new THREE.Points(pulseGeo, dotMat));
    const tmp = new THREE.Vector3();
    const placePulses = (dt: number) => {
      pulses.forEach((p, i) => {
        p.t += dt * p.v;
        if (p.t > 1) { p.t = 0; p.e = Math.floor(rand() * edges.length); }
        const [a, b] = edges[p.e];
        tmp.lerpVectors(nodes[a].p, nodes[b].p, p.t).toArray(pPos, i * 3);
      });
      pulseGeo.attributes.position.needsUpdate = true;
    };
    placePulses(0);

    // ── sizing, pointer parallax, visibility ──
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.position.z = camera.aspect < 0.9 ? 14 : 11;
      camera.updateProjectionMatrix();
      dotMat.uniforms.uScale.value = height / 600;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true, raf = 0, last = performance.now();
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !reduced) loop(); });
    io.observe(el);

    world.rotation.set(0.35, -0.5, 0);
    const frame = (dt: number) => {
      world.rotation.y += dt * 0.08;
      world.rotation.x += (0.35 + pointer.y * 0.25 - world.rotation.x) * 0.04;
      camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.04;
      camera.lookAt(0, 0, 0);
      placePulses(dt);
      renderer.render(scene, camera);
    };
    function loop() {
      cancelAnimationFrame(raf);
      const tick = (now: number) => {
        // Check on-screen state ourselves too: on a slow device, rendering can starve the
        // IntersectionObserver so it reports "left the viewport" late. The observer restarts us.
        const r = el!.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) { visible = false; return; }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        frame(dt);
        if (visible) raf = requestAnimationFrame(tick);
      };
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    if (reduced) frame(0); else loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      [nodeGeo, edgeGeo, pulseGeo].forEach(g => g.dispose());
      [dotMat, edgeMat].forEach(m => m.dispose());
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} aria-hidden className={`[&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}
