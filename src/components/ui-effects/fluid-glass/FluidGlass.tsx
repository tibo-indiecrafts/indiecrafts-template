"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- r3f's `ThreeElements['mesh']` props bag and drei's shader-material proxies carry many heterogeneous types; pinning each `any` would balloon the file with no runtime benefit. */

import {
  Image,
  MeshTransmissionMaterial,
  Preload,
  Scroll,
  ScrollControls,
  Text,
  useFBO,
  useGLTF,
  useScroll,
} from "@react-three/drei";
import {
  Canvas,
  createPortal,
  type ThreeElements,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { easing } from "maath";
import * as React from "react";
import * as THREE from "three";

type Mode = "lens" | "bar" | "cube";

interface NavItem {
  label: string;
  link: string;
}

type ModeProps = Record<string, unknown>;

export interface FluidGlassProps {
  mode?: Mode;
  lensProps?: ModeProps;
  barProps?: ModeProps;
  cubeProps?: ModeProps;
}

/**
 * drei's `MeshTransmissionMaterial`, `Float`, `Sparkles` etc. still read
 * `state.clock.elapsedTime` from r3f's frame state. r3f v10-alpha removed
 * `state.clock` in favor of `state.elapsed`, so drei components crash with
 * "Cannot read properties of undefined (reading 'elapsedTime')".
 *
 * This shim mutates the root state object directly to install a `clock`
 * key. r3f v10's `set()` ignores unknown keys, so we have to bypass it and
 * write to the state object the store returns. `useLayoutEffect` runs
 * before the first `useFrame` callback fires, so by the time drei reads
 * `state.clock.elapsedTime` it's there.
 */
function ClockShim() {
  const get = useThree((s) => s.get);
  const [clock] = React.useState(() => {
    const c = new THREE.Clock();
    c.start();
    return c;
  });
  React.useLayoutEffect(() => {
    (get() as any).clock = clock;
  }, [get, clock]);
  useFrame(() => {
    // Ensure clock stays installed across r3f re-creates and keep elapsedTime fresh.
    const state = get() as any;
    if (state.clock !== clock) state.clock = clock;
    clock.getElapsedTime();
  });
  return null;
}

export function FluidGlass({
  mode = "lens",
  lensProps = {},
  barProps = {},
  cubeProps = {},
}: Readonly<FluidGlassProps>) {
  const Wrapper = mode === "bar" ? Bar : mode === "cube" ? Cube : Lens;
  const raw = mode === "bar" ? barProps : mode === "cube" ? cubeProps : lensProps;
  const {
    navItems = [
      { label: "Home", link: "" },
      { label: "About", link: "" },
      { label: "Contact", link: "" },
    ],
    ...modeProps
  } = raw;

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <ClockShim />
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        {mode === "bar" && <NavItems items={navItems as NavItem[]} />}
        <Wrapper modeProps={modeProps}>
          <Scroll>
            <Typography />
            <Images />
          </Scroll>
          <Scroll html />
          <Preload />
        </Wrapper>
      </ScrollControls>
    </Canvas>
  );
}

type MeshJSXProps = ThreeElements["mesh"];

interface ModeWrapperProps extends MeshJSXProps {
  children?: React.ReactNode;
  glb: string;
  geometryKey: string;
  lockToBottom?: boolean;
  followPointer?: boolean;
  modeProps?: ModeProps;
}

const ModeWrapper = React.memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}: ModeWrapperProps) {
  const ref = React.useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = React.useState<THREE.Scene>(() => new THREE.Scene());
  const geoWidthRef = React.useRef<number>(1);

  React.useEffect(() => {
    const geo = (nodes[geometryKey] as THREE.Mesh)?.geometry;
    if (!geo) return;
    geo.computeBoundingBox();
    geoWidthRef.current = geo.boundingBox!.max.x - geo.boundingBox!.min.x || 1;
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom
      ? -v.height / 2 + 0.2
      : followPointer
        ? (pointer.y * v.height) / 2
        : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
    if ((modeProps as { scale?: number }).scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x5227ff, 1);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } =
    modeProps as {
      scale?: number;
      ior?: number;
      thickness?: number;
      anisotropy?: number;
      chromaticAberration?: number;
      [key: string]: unknown;
    };

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={(nodes[geometryKey] as THREE.Mesh)?.geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }: { modeProps?: ModeProps } & MeshJSXProps) {
  return (
    <ModeWrapper
      glb="/assets/3d/lens.glb"
      geometryKey="Cylinder"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}

function Cube({ modeProps, ...p }: { modeProps?: ModeProps } & MeshJSXProps) {
  return (
    <ModeWrapper
      glb="/assets/3d/cube.glb"
      geometryKey="Cube"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}

function Bar({ modeProps = {}, ...p }: { modeProps?: ModeProps } & MeshJSXProps) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: "#ffffff",
    attenuationColor: "#ffffff",
    attenuationDistance: 0.25,
  };
  return (
    <ModeWrapper
      glb="/assets/3d/bar.glb"
      geometryKey="Cube"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

const DEVICE_NAV = {
  mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
  tablet: { max: 1023, spacing: 0.24, fontSize: 0.045 },
  desktop: { max: Infinity, spacing: 0.3, fontSize: 0.045 },
};

function subscribeResize(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

function getDeviceKey(): keyof typeof DEVICE_NAV {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  return w <= DEVICE_NAV.mobile.max
    ? "mobile"
    : w <= DEVICE_NAV.tablet.max
      ? "tablet"
      : "desktop";
}

function useDevice() {
  return React.useSyncExternalStore(
    subscribeResize,
    getDeviceKey,
    () => "desktop" as const,
  );
}

function NavItems({ items }: { items: NavItem[] }) {
  const group = React.useRef<THREE.Group>(null!);
  const { viewport, camera } = useThree();
  const device = useDevice();
  const { spacing, fontSize } = DEVICE_NAV[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);
    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = (link: string) => {
    if (!link) return;
    // window.location assignment is the right primitive here — React
    // Compiler conservatively flags `window` as immutable.
    /* eslint-disable react-hooks/immutability -- intentional navigation */
    if (link.startsWith("#")) window.location.hash = link;
    else window.location.href = link;
    /* eslint-enable react-hooks/immutability */
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          renderOrder={10}
          onClick={(e: any) => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

interface ZoomMaterial extends THREE.Material {
  zoom: number;
}
type ZoomMesh = THREE.Mesh<THREE.BufferGeometry, ZoomMaterial>;
type ZoomGroup = THREE.Group & { children: ZoomMesh[] };

function Images() {
  const group = React.useRef<ZoomGroup>(null!);
  const data = useScroll();
  const { height } = useThree((s) => s.viewport);

  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
  });

  return (
    // drei's <Image> renders a 3D textured plane, not an HTML <img>.
    /* eslint-disable jsx-a11y/alt-text -- drei <Image> is a 3D mesh, not an HTMLImageElement */
    <group ref={group}>
      <Image
        position={[-2, 0, 0]}
        scale={[3, height / 1.1]}
        url="/assets/demo/cs1.webp"
      />
      <Image position={[2, 0, 3]} scale={3} url="/assets/demo/cs2.webp" />
      <Image position={[-2.05, -height, 6]} scale={[1, 3]} url="/assets/demo/cs3.webp" />
      <Image position={[-0.6, -height, 9]} scale={[1, 2]} url="/assets/demo/cs1.webp" />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url="/assets/demo/cs2.webp" />
    </group>
    /* eslint-enable jsx-a11y/alt-text */
  );
}

const DEVICE_TYPO = {
  mobile: { fontSize: 0.2 },
  tablet: { fontSize: 0.4 },
  desktop: { fontSize: 0.6 },
};

function Typography() {
  const device = useDevice();
  const { fontSize } = DEVICE_TYPO[device];
  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      React Bits
    </Text>
  );
}
