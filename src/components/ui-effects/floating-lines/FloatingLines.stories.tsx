import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FloatingLines } from "./index";

const meta: Meta<typeof FloatingLines> = {
  title: "UI Effects/Backgrounds/FloatingLines",
  component: FloatingLines,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FloatingLines>;

// The user's snippet originally used gradientStart/Mid/End props which don't
// exist upstream — the upstream API is `linesGradient: string[]`. Mapped
// the three hex values to a gradient array here.
export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <FloatingLines
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={8}
        lineDistance={8}
        bendRadius={8}
        bendStrength={-2}
        interactive
        parallax
        animationSpeed={1}
        linesGradient={["#e945f5", "#6f6f6f", "#6a6a6a"]}
      />
    </div>
  ),
};
