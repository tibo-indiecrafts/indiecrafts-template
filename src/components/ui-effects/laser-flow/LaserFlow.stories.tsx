import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { LaserFlow } from "./index";

const meta: Meta<typeof LaserFlow> = {
  title: "UI Effects/Animations/LaserFlow",
  component: LaserFlow,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LaserFlow>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[500px] w-full overflow-hidden">
        <LaserFlow />
      </div>
    </div>
  ),
};

function RevealStage() {
  const revealImgRef = React.useRef<HTMLImageElement>(null);
  return (
    <div
      className="relative h-[800px] w-full overflow-hidden bg-[#120F17]"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          el.style.setProperty("--my", `${e.clientY - rect.top}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty("--mx", "-9999px");
          el.style.setProperty("--my", "-9999px");
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#CF9EFF"
        horizontalSizing={0.5}
        verticalSizing={2}
        wispDensity={1}
        wispSpeed={15}
        wispIntensity={5}
        flowSpeed={0.35}
        flowStrength={0.25}
        fogIntensity={0.45}
        fogScale={0.3}
        fogFallSpeed={0.6}
        decay={1.1}
        falloffStart={1.2}
      />

      {/* eslint-disable-next-line @next/next/no-img-element -- the reveal image is purely decorative, masked into a moving radial gradient via inline CSS vars; next/image's wrapper breaks the mask-image stack */}
      <img
        ref={revealImgRef}
        src="https://images.unsplash.com/photo-1748370987492-eb390a61dcda?q=80&w=1600&auto=format&fit=crop"
        alt=""
        className="pointer-events-none absolute inset-0 z-[5] h-full w-full object-cover"
        style={
          {
            "--mx": "-9999px",
            "--my": "-9999px",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 80px, rgba(255,255,255,0.6) 160px, rgba(255,255,255,0.25) 240px, rgba(255,255,255,0) 320px)",
            maskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 80px, rgba(255,255,255,0.6) 160px, rgba(255,255,255,0.25) 240px, rgba(255,255,255,0) 320px)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          } as React.CSSProperties
        }
      />

      <div className="absolute top-1/2 left-1/2 z-[6] flex h-[60%] w-[86%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[20px] border-2 border-[#FF79C6] text-2xl text-white">
        Move your cursor
      </div>
    </div>
  );
}

export const RevealBox: Story = {
  render: () => (
    <div className="flex min-h-dvh w-full items-center justify-center bg-black p-6">
      <div className="w-full max-w-6xl">
        <RevealStage />
      </div>
    </div>
  ),
};
