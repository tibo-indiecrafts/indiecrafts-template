import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GhostCursor } from "./index";

const meta: Meta<typeof GhostCursor> = {
  title: "UI Effects/Cursor/GhostCursor",
  component: GhostCursor,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GhostCursor>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black text-white">
      <div className="relative h-[600px] w-[80vw] max-w-5xl overflow-hidden rounded-xl border border-white/10">
        <GhostCursor
          color="#B497CF"
          brightness={2}
          edgeIntensity={0}
          trailLength={50}
          inertia={0.5}
          grainIntensity={0.05}
          bloomStrength={0.1}
          bloomRadius={1}
          bloomThreshold={0.025}
          fadeDelayMs={1000}
          fadeDurationMs={1500}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl text-white/40">
          Move your cursor inside this box
        </div>
      </div>
    </div>
  ),
};
