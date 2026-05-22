import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DotField } from "./index";

const meta: Meta<typeof DotField> = {
  title: "UI Effects/Backgrounds/DotField",
  component: DotField,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DotField>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <DotField
        dotRadius={1.5}
        dotSpacing={14}
        bulgeStrength={67}
        glowRadius={160}
        sparkle={false}
        waveAmplitude={0}
        cursorRadius={500}
        cursorForce={0.1}
        bulgeOnly
        gradientFrom="#A855F7"
        gradientTo="#B497CF"
        glowColor="#120F17"
      />
    </div>
  ),
};
