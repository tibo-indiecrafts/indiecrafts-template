import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextShimmerWave } from "./index";

const meta: Meta<typeof TextShimmerWave> = {
  title: "UI Effects/Text/TextShimmerWave",
  component: TextShimmerWave,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TextShimmerWave>;

export const Basic: Story = {
  render: () => (
    <TextShimmerWave className="font-mono text-sm" duration={1}>
      Generating code...
    </TextShimmerWave>
  ),
};

export const Color: Story = {
  render: () => (
    <TextShimmerWave
      className="[--base-color:#0D74CE] [--base-gradient-color:#5EB1EF]"
      duration={1}
      spread={1}
      zDistance={1}
      scaleDistance={1.1}
      rotateYDistance={20}
    >
      Creating the perfect dish...
    </TextShimmerWave>
  ),
};
