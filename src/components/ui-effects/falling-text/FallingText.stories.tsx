import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FallingText } from "./index";

const meta: Meta<typeof FallingText> = {
  title: "UI Effects/Text/FallingText",
  component: FallingText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FallingText>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black px-8 text-white">
      <div className="relative h-[60vh] w-full max-w-3xl">
        <FallingText
          text="React Bits is a library of animated and interactive React components designed to streamline UI development and simplify your workflow."
          highlightWords={["React", "Bits", "animated", "components", "simplify"]}
          trigger="hover"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.56}
          fontSize="2rem"
          mouseConstraintStiffness={0.9}
        />
      </div>
    </div>
  ),
};
