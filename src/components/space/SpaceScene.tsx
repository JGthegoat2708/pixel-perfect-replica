import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { spaceState } from "@/lib/scroll";

function makeGlowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makePlanetTexture(a: string, b: string, bands: number) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  for (let i = 0; i <= bands; i++) g.addColorStop(i / bands, i % 2 ? a : b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 256, Math.random() * 80, 2 + Math.random() * 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const damp = THREE.MathUtils.damp;

function CameraRig() {
  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const cam = state.camera;
    const p = spaceState.progress;
    cam.position.z = damp(cam.position.z, 8 - p * 46, 2.5, dt);
    cam.position.x = damp(cam.position.x, spaceState.mx * 0.7, 2, dt);
    cam.position.y = damp(cam.position.y, -spaceState.my * 0.45 - p * 3, 2, dt);
    cam.lookAt(spaceState.mx * 0.3, -p * 3, cam.position.z - 10);
  });
  return null;
}

function AICore() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const width = useThree((s) => s.size.width);
  const mobile = width < 900;
  const glow = useMemo(() => makeGlowTexture("rgba(170,205,255,0.95)", "rgba(80,130,255,0.35)"), []);

  const COUNT = 420;
  const particles = useMemo(() => {
    const dirs = new Float32Array(COUNT * 3);
    const radii = new Float32Array(COUNT);
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const v = new THREE.Vector3().randomDirection();
      dirs.set([v.x, v.y, v.z], i * 3);
      radii[i] = 1.2 + Math.random() * 3;
    }
    return { dirs, radii, pos };
  }, []);
  const pointsGeo = useRef<THREE.BufferGeometry>(null);

  useFrame((state, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * 0.18;
    g.rotation.x = damp(g.rotation.x, spaceState.my * 0.35, 3, dt);
    g.rotation.z = damp(g.rotation.z, -spaceState.mx * 0.25, 3, dt);
    inner.current?.scale.setScalar(1 + Math.sin(t * 2.2) * 0.05);
    if (shell.current) shell.current.rotation.y -= dt * 0.4;
    if (ringA.current) ringA.current.rotation.z += dt * 0.6;
    if (ringB.current) ringB.current.rotation.x += dt * 0.45;

    const { dirs, radii, pos } = particles;
    for (let i = 0; i < COUNT; i++) {
      let r = radii[i]! + dt * (0.25 + (i % 7) * 0.05);
      if (r > 4.3) r = 1.1;
      radii[i] = r;
      pos[i * 3] = dirs[i * 3]! * r;
      pos[i * 3 + 1] = dirs[i * 3 + 1]! * r;
      pos[i * 3 + 2] = dirs[i * 3 + 2]! * r;
    }
    const attr = pointsGeo.current?.getAttribute("position");
    if (attr) attr.needsUpdate = true;
  });

  return (
    <group ref={group} position={mobile ? [0, 1.4, -1] : [2.8, 0.1, 0]} scale={mobile ? 0.7 : 1}>
      <sprite scale={[7, 7, 1]}>
        <spriteMaterial map={glow} transparent depthWrite={false} opacity={0.85} />
      </sprite>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.9, 6]} />
        <meshStandardMaterial color="#4d7dff" emissive="#2f5cff" emissiveIntensity={1.4} roughness={0.15} metalness={0.4} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.45, 1]} />
        <meshBasicMaterial color="#2b4fc9" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringA} rotation-x={Math.PI / 2.4}>
        <torusGeometry args={[2.1, 0.012, 8, 200]} />
        <meshBasicMaterial color="#3a64ff" transparent opacity={0.7} />
      </mesh>
      <mesh ref={ringB} rotation-y={Math.PI / 3}>
        <torusGeometry args={[2.6, 0.008, 8, 200]} />
        <meshBasicMaterial color="#7aa6ff" transparent opacity={0.55} />
      </mesh>
      <points>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#3d6bff" transparent opacity={0.8} depthWrite={false} />
      </points>
    </group>
  );
}

function SpaceDust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const n = 1800;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      a[i * 3] = (Math.random() - 0.5) * 50;
      a[i * 3 + 1] = (Math.random() - 0.5) * 30;
      a[i * 3 + 2] = 10 - Math.random() * 75;
    }
    return a;
  }, []);
  useFrame((_, raw) => {
    if (!ref.current) return;
    ref.current.rotation.z += Math.min(raw, 0.05) * 0.01;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.15 + spaceState.progress * 0.75;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#dbe7ff" transparent opacity={0.3} depthWrite={false} />
    </points>
  );
}

function Nebula() {
  const items = useMemo(
    () => [
      { tex: makeGlowTexture("rgba(90,120,255,0.9)", "rgba(40,60,180,0.3)"), pos: [-12, 4, -26], s: 34 },
      { tex: makeGlowTexture("rgba(80,200,230,0.8)", "rgba(30,90,140,0.25)"), pos: [14, -6, -36], s: 40 },
      { tex: makeGlowTexture("rgba(170,120,255,0.7)", "rgba(70,40,150,0.25)"), pos: [-6, -10, -50], s: 46 },
      { tex: makeGlowTexture("rgba(120,160,255,0.7)", "rgba(40,60,140,0.2)"), pos: [8, 8, -58], s: 50 },
    ] as const,
    [],
  );
  const mats = useRef<(THREE.SpriteMaterial | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mats.current.forEach((m, i) => {
      if (!m) return;
      m.opacity = (0.08 + spaceState.progress * 0.5) * (0.85 + Math.sin(t * 0.3 + i) * 0.15);
      m.rotation = t * 0.01 * (i % 2 ? 1 : -1) + spaceState.progress * (i + 1) * 0.3;
    });
  });
  return (
    <>
      {items.map((n, i) => (
        <sprite key={i} position={n.pos as unknown as [number, number, number]} scale={[n.s, n.s, 1]}>
          <spriteMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            map={n.tex}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </>
  );
}

function Planet({
  position,
  radius,
  colors,
  ring,
  speed,
}: {
  position: [number, number, number];
  radius: number;
  colors: [string, string];
  ring?: boolean;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => makePlanetTexture(colors[0], colors[1], 9), [colors]);
  useFrame((state, raw) => {
    if (!ref.current) return;
    ref.current.rotation.y += Math.min(raw, 0.05) * speed;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2 + radius) * 0.4;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial map={tex} roughness={0.8} metalness={0.1} />
      </mesh>
      {ring && (
        <mesh rotation-x={Math.PI / 2.3}>
          <ringGeometry args={[radius * 1.4, radius * 2.1, 96]} />
          <meshBasicMaterial color="#c9d6ff" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function Universe() {
  const stars = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!stars.current) return;
    stars.current.rotation.y = spaceState.progress * 0.8 + state.clock.elapsedTime * 0.006;
    stars.current.rotation.x = spaceState.progress * 0.2;
  });
  return (
    <>
      <group ref={stars}>
        <Stars radius={90} depth={60} count={4500} factor={3.2} saturation={0} fade speed={0.5} />
      </group>
      <Nebula />
      <SpaceDust />
      <Planet position={[-7, 2.5, -14]} radius={1.6} colors={["#6f8fd8", "#2c3f86"]} speed={0.08} />
      <Planet position={[9, -3, -27]} radius={2.6} colors={["#d9b98c", "#8a6440"]} ring speed={0.05} />
      <Planet position={[-10, -5, -42]} radius={3.4} colors={["#7fc7d6", "#21607a"]} speed={0.04} />
    </>
  );
}

export default function SpaceScene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      <Canvas dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 8], fov: 55, far: 300 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 8, 6]} intensity={1.8} color="#eef3ff" />
        <pointLight position={[2.8, 0, 2]} intensity={12} color="#5a86ff" distance={12} />
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1} color="#88aaff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <CameraRig />
        <AICore />
        <Universe />
      </Canvas>
    </div>
  );
}
