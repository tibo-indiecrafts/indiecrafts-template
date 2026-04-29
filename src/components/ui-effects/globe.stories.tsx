import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Canvas } from "@react-three/fiber";
import { Globe } from "./globe";

const meta: Meta<typeof Globe> = {
  title: "UI Effects/Globe",
  component: Globe,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Globe>;

const ARC_DATA = [
  {
    order: 1,
    startLat: 40.7128,
    startLng: -74.006,
    endLat: 51.5074,
    endLng: -0.1278,
    arcAlt: 0.3,
    color: "#06b6d4",
  },
  {
    order: 2,
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.4,
    color: "#8b5cf6",
  },
  {
    order: 3,
    startLat: 48.8566,
    startLng: 2.3522,
    endLat: 19.4326,
    endLng: -99.1332,
    arcAlt: 0.35,
    color: "#ec4899",
  },
];

const MANY_ARCS = [
  ...ARC_DATA,
  {
    order: 4,
    startLat: -23.5505,
    startLng: -46.6333,
    endLat: 28.6139,
    endLng: 77.209,
    arcAlt: 0.45,
    color: "#f59e0b",
  },
  {
    order: 5,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 55.7558,
    endLng: 37.6173,
    arcAlt: 0.42,
    color: "#10b981",
  },
  {
    order: 6,
    startLat: -34.6037,
    startLng: -58.3816,
    endLat: 30.0444,
    endLng: 31.2357,
    arcAlt: 0.5,
    color: "#3b82f6",
  },
  {
    order: 7,
    startLat: 37.7749,
    startLng: -122.4194,
    endLat: -1.2921,
    endLng: 36.8219,
    arcAlt: 0.55,
    color: "#ef4444",
  },
];

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative mx-auto h-[600px] w-full max-w-3xl">
    {children}
  </div>
);

/**
 * Default — three arcs (NY → London, Tokyo → Sydney, Paris → Mexico City) on
 * a deep purple globe with a white atmosphere. The component must mount
 * inside a `<Canvas>` from `@react-three/fiber`.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
        <Globe
          globeConfig={{
            globeColor: "#1d072e",
            atmosphereColor: "#ffffff",
            showAtmosphere: true,
            autoRotate: true,
            autoRotateSpeed: 0.5,
          }}
          data={ARC_DATA}
        />
      </Canvas>
    </Stage>
  ),
};

/** Many arcs — seven destinations exercise the ring + arc animation density. */
export const ManyArcs: Story = {
  render: () => (
    <Stage>
      <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
        <Globe
          globeConfig={{
            globeColor: "#1d072e",
            atmosphereColor: "#ffffff",
            showAtmosphere: true,
            autoRotate: true,
            autoRotateSpeed: 0.4,
          }}
          data={MANY_ARCS}
        />
      </Canvas>
    </Stage>
  ),
};

/**
 * Brand surface — replace the purple base with the template&apos;s brand
 * colour. three.js can&apos;t resolve CSS vars, so we hard-code the sRGB
 * equivalent of `oklch(0.55 0.18 260)` from `theme.config.ts`.
 */
export const BrandSurface: Story = {
  render: () => (
    <Stage>
      <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
        <Globe
          globeConfig={{
            globeColor: "#0f172a",
            atmosphereColor: "#4f46e5",
            atmosphereAltitude: 0.15,
            polygonColor: "rgba(79,70,229,0.45)",
            emissive: "#4f46e5",
            emissiveIntensity: 0.2,
            autoRotate: true,
            autoRotateSpeed: 0.3,
          }}
          data={ARC_DATA}
        />
      </Canvas>
    </Stage>
  ),
};

/** No atmosphere — `showAtmosphere={false}` removes the soft halo. */
export const NoAtmosphere: Story = {
  render: () => (
    <Stage>
      <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
        <Globe
          globeConfig={{
            globeColor: "#1d072e",
            showAtmosphere: false,
            autoRotate: true,
            autoRotateSpeed: 0.5,
          }}
          data={ARC_DATA}
        />
      </Canvas>
    </Stage>
  ),
};
