import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef } from "react";

import { useMousePosition } from "@/components/_hooks/use-mouse-position";

import { PixelateSvgFilter } from "./index";

const meta: Meta<typeof PixelateSvgFilter> = {
  title: "UI Effects/Filters/PixelateSvgFilter",
  component: PixelateSvgFilter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PixelateSvgFilter>;

function Stage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition(containerRef);
  // Cursor X drives the pixel size: 1px at the left edge → 64px on the right.
  const pixelSize = Math.min(Math.max(mouse.x / 30, 1), 64);

  return (
    <div
      ref={containerRef}
      className="relative flex h-dvh w-dvw flex-col items-center justify-center gap-4 bg-black"
    >
      <PixelateSvgFilter id="pixelate-filter" size={pixelSize} crossLayers />
      <div
        className="relative h-1/2 w-1/2 overflow-hidden text-white md:w-1/3"
        style={{ filter: "url(#pixelate-filter)" }}
      >
        <video
          src="https://cdn.cosmos.so/96ae0b34-289d-489d-94a1-c68925ddd3a9.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          loop
        />
      </div>
    </div>
  );
}

export const CursorDriven: Story = {
  render: () => <Stage />,
};

export const Static: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center gap-8 bg-black">
      <PixelateSvgFilter id="pixelate-static" size={12} crossLayers />
      <div
        className="relative h-64 w-64 overflow-hidden"
        style={{ filter: "url(#pixelate-static)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff5941] via-[#e794da] to-[#0015ff]" />
      </div>
      <p className="text-sm text-white/60">size=12, crossLayers</p>
    </div>
  ),
};
