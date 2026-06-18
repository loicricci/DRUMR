"use client";

import {
  useRef,
  useMemo,
  Suspense,
  createContext,
  useContext,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export type StageId = "idea" | "psf" | "pmf" | "governance";

export type InteractionState = {
  pointer: { x: number; y: number };
  hovering: boolean;
  dragging: boolean;
  spinVelocity: number;
};

export const STAGE_META: Record<
  StageId,
  {
    label: string;
    color: string;
    agents: string[];
    description: string;
  }
> = {
  idea: {
    label: "Idea",
    color: "#7dd3fc",
    agents: ["Ideator", "Market Intelligence"],
    description: "Generate & rank ideas on viability, desirability, feasibility",
  },
  psf: {
    label: "PSF",
    color: "#c4b5fd",
    agents: ["Hypothesis Builder", "Persona Profiler", "Early Data Manager", "POC Agent"],
    description: "Validate solution fit with experiments & early user data",
  },
  pmf: {
    label: "PMF",
    color: "#7efcb8",
    agents: ["Persona Refiner", "MVP Architect", "Go-to-Market Agent", "KPI Analyst"],
    description: "Architect, launch & measure repeatable market demand",
  },
  governance: {
    label: "Governance",
    color: "#fcd34d",
    agents: ["CEO Agent", "Governance Agent"],
    description: "Progress reports & gate decisions at every advance",
  },
};

const COLORS = {
  bg: "#0c1512",
  core: "#7efcb8",
};

const STAGES = [
  { id: "idea" as const, y: -1.5, radius: 0.95, speed: 0.5, agents: 2, bubbleSize: 0.085 },
  { id: "psf" as const, y: -0.5, radius: 1.15, speed: 0.38, agents: 4, bubbleSize: 0.08 },
  { id: "pmf" as const, y: 0.5, radius: 1.05, speed: 0.32, agents: 4, bubbleSize: 0.08 },
  { id: "governance" as const, y: 1.5, radius: 0.8, speed: 0.26, agents: 2, bubbleSize: 0.09 },
];

type SceneContextValue = {
  activeStage: StageId;
  interaction: MutableRefObject<InteractionState>;
};

const SceneContext = createContext<SceneContextValue>({
  activeStage: "idea",
  interaction: { current: { pointer: { x: 0, y: 0 }, hovering: false, dragging: false, spinVelocity: 0 } },
});

const useSceneContext = () => useContext(SceneContext);

function InteractiveRig() {
  const { camera } = useThree();
  const { interaction } = useSceneContext();
  const lookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state) => {
    const { pointer, hovering, dragging } = interaction.current;
    const auto = state.clock.elapsedTime * 0.06;
    const baseX = Math.sin(auto) * 0.25;
    const reach = dragging ? 1.1 : 0.9;
    const targetX = baseX + (hovering ? pointer.x * reach : 0);
    const targetY = 0.15 + (hovering ? pointer.y * 0.55 : 0);
    // closer when grabbing for a tactile "lean in" feel
    const targetZ = dragging ? 4.7 : 5;

    const ease = dragging ? 0.12 : 0.06;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, ease);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, ease);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.lookAt(lookAt);
  });

  return null;
}

type AgentBubbleProps = {
  stageId: StageId;
  baseAngle: number;
  radius: number;
  y: number;
  speed: number;
  size: number;
  phase: number;
};

function AgentBubble({ stageId, baseAngle, radius, y, speed, size, phase }: AgentBubbleProps) {
  const { activeStage } = useSceneContext();
  const color = STAGE_META[stageId].color;
  const isActive = activeStage === stageId;
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // angle keeps the even baseAngle spacing around the ring; phase only
    // affects vertical bob so bubbles stay coherently distributed.
    const angle = state.clock.elapsedTime * speed + baseAngle;
    const bob = Math.sin(state.clock.elapsedTime * 1.8 + phase) * 0.05;
    const t = angle;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    if (groupRef.current) {
      groupRef.current.position.set(x, y + bob, z);
    }
    if (coreRef.current) {
      const target = isActive ? 1.25 : 0.8;
      const s = THREE.MathUtils.lerp(coreRef.current.scale.x, target, 0.1);
      coreRef.current.scale.setScalar(s);
    }
    if (haloRef.current) {
      const pulse = (isActive ? 1.3 : 0.9) + Math.sin(t * 2.5) * 0.12;
      haloRef.current.scale.setScalar(pulse);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = isActive
        ? 0.28
        : 0.07;
    }
    if (trailRef.current) {
      trailRef.current.rotation.z = -t;
      (trailRef.current.material as THREE.MeshBasicMaterial).opacity = isActive
        ? 0.5
        : 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* comet trail arc following the orbit */}
      <mesh ref={trailRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.4, size * 1.7, 24, 1, 0, Math.PI * 0.6]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[size * 2.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 1.4 : 0.45}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={isActive ? 1 : 0.6}
        />
      </mesh>
    </group>
  );
}

function StageRing({ stageId, y, radius }: { stageId: StageId; y: number; radius: number }) {
  const { activeStage } = useSceneContext();
  const color = STAGE_META[stageId].color;
  const isActive = activeStage === stageId;
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * (isActive ? 0.25 : 0.06);
    }
    if (matRef.current) {
      matRef.current.opacity = THREE.MathUtils.lerp(
        matRef.current.opacity,
        isActive ? 0.7 : 0.18,
        0.1
      );
    }
  });

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <group position={[0, y, 0]}>
      <Line points={points} color={color} transparent opacity={isActive ? 0.7 : 0.18} lineWidth={isActive ? 1.6 : 0.8} />
      {/* dashed inner accent ring that spins */}
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64, 1]} />
        <meshBasicMaterial
          ref={matRef}
          color={color}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function FlowHelix() {
  const lineRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const yStart = STAGES[0].y;
    const yEnd = STAGES[STAGES.length - 1].y;
    for (let i = 0; i <= 200; i++) {
      const p = i / 200;
      const y = THREE.MathUtils.lerp(yStart, yEnd, p);
      const angle = p * Math.PI * 5;
      const r = 0.35 + Math.sin(p * Math.PI) * 0.15;
      pts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={lineRef}>
      <Line points={points} color={COLORS.core} transparent opacity={0.22} lineWidth={1} />
    </group>
  );
}

function FlowParticles() {
  const count = 22;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const yMin = STAGES[0].y;
  const yMax = STAGES[STAGES.length - 1].y;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const progress = (t * (0.1 + (i % 5) * 0.015) + i / count) % 1;
      const y = THREE.MathUtils.lerp(yMin, yMax, progress);
      const angle = progress * Math.PI * 5 + t * 0.1;
      const r = 0.35 + Math.sin(progress * Math.PI) * 0.15;
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      const fade = Math.sin(progress * Math.PI);
      dummy.scale.setScalar(0.018 + fade * 0.012);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={COLORS.core} transparent opacity={0.7} />
    </instancedMesh>
  );
}

function CoreNucleus() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3;
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
      <group>
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.12, 1]} />
          <meshStandardMaterial
            color={COLORS.core}
            emissive={COLORS.core}
            emissiveIntensity={1.1}
            roughness={0.1}
            metalness={0.5}
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.06, 24, 24]} />
          <meshStandardMaterial
            color={COLORS.core}
            emissive={COLORS.core}
            emissiveIntensity={1.6}
            roughness={0.05}
            metalness={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Scene() {
  const { interaction } = useSceneContext();
  const groupRef = useRef<THREE.Group>(null);
  const spin = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const it = interaction.current;
    const dt = Math.min(delta, 0.05);

    // idle drift, slowed while the user is actively grabbing
    const idleSpeed = it.dragging ? 0.02 : 0.14;
    spin.current += idleSpeed * dt;

    // apply + damp the flung momentum from dragging (the "grip")
    spin.current += it.spinVelocity * dt;
    it.spinVelocity *= it.dragging ? 0.6 : 0.94;
    if (Math.abs(it.spinVelocity) < 0.0002) it.spinVelocity = 0;

    groupRef.current.rotation.y = spin.current;

    // vertical tilt follows the cursor with a springy ease
    const targetX =
      THREE.MathUtils.degToRad(8) + (it.hovering ? it.pointer.y * 0.22 : 0);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      it.dragging ? 0.18 : 0.06
    );
  });

  return (
    <>
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 6, 13]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 2, 3]} intensity={1} color={COLORS.core} />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#c4b5fd" />
      <pointLight position={[0, 3, -2]} intensity={0.4} color="#fcd34d" />

      <InteractiveRig />

      <Sparkles count={45} scale={[5, 5.5, 5]} size={1.2} speed={0.12} opacity={0.3} color={COLORS.core} />

      <group ref={groupRef}>
        <CoreNucleus />
        <FlowHelix />
        <FlowParticles />

        {STAGES.map((stage) => (
          <group key={stage.id}>
            <StageRing stageId={stage.id} y={stage.y} radius={stage.radius} />
            {Array.from({ length: stage.agents }).map((_, i) => (
              <AgentBubble
                key={`${stage.id}-${i}`}
                stageId={stage.id}
                baseAngle={(i / stage.agents) * Math.PI * 2}
                radius={stage.radius}
                y={stage.y}
                speed={stage.speed}
                size={stage.bubbleSize}
                phase={i * 1.7}
              />
            ))}
          </group>
        ))}
      </group>

      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.65} mipmapBlur radius={0.6} />
      </EffectComposer>
    </>
  );
}

function SceneFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color={COLORS.core} wireframe transparent opacity={0.3} />
    </mesh>
  );
}

type ProjectLifecycle3DProps = {
  className?: string;
  activeStage: StageId;
  interaction: MutableRefObject<InteractionState>;
};

export function ProjectLifecycle3D({ className, activeStage, interaction }: ProjectLifecycle3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.15, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: COLORS.bg }}
      >
        <SceneContext.Provider value={{ activeStage, interaction }}>
          <Suspense fallback={<SceneFallback />}>
            <Scene />
          </Suspense>
        </SceneContext.Provider>
      </Canvas>
    </div>
  );
}
