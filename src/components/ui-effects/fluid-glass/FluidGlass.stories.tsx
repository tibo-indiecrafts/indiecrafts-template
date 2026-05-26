import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FluidGlass } from "./index";

const meta: Meta<typeof FluidGlass> = {
  title: "UI Effects/Hover & Interactions/FluidGlass",
  component: FluidGlass,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FluidGlass>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <div className="relative h-[600px] w-full">
        <FluidGlass
          mode="lens"
          lensProps={{
            scale: 0.25,
            ior: 1.15,
            thickness: 5,
            chromaticAberration: 0.1,
            anisotropy: 0.01,
          }}
        />
      </div>
    </div>
  ),
};

export const BarMode: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <FluidGlass
        mode="bar"
        barProps={{
          navItems: [
            { label: "Home", link: "#home" },
            { label: "Work", link: "#work" },
            { label: "About", link: "#about" },
            { label: "Contact", link: "#contact" },
          ],
        }}
      />
    </div>
  ),
};

export const CubeMode: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <FluidGlass
        mode="cube"
        cubeProps={{
          scale: 0.3,
          ior: 1.2,
          thickness: 3,
          chromaticAberration: 0.08,
        }}
      />
    </div>
  ),
};
