import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LetterGlitch } from "./index";

const meta: Meta<typeof LetterGlitch> = {
  title: "UI Effects/Backgrounds/LetterGlitch",
  component: LetterGlitch,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LetterGlitch>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <LetterGlitch
        glitchSpeed={50}
        centerVignette
        outerVignette={false}
        smooth
        glitchColors={["#2b4539", "#61dca3", "#61b3dc"]}
      />
    </div>
  ),
};
