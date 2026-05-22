import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VariableFontHoverByRandomLetter } from "./index";

const meta: Meta<typeof VariableFontHoverByRandomLetter> = {
  title: "UI Effects/Text/VariableFontHoverByRandomLetter",
  component: VariableFontHoverByRandomLetter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof VariableFontHoverByRandomLetter>;

export const Showcase: Story = {
  render: () => (
    <div className="h-dvh w-dvw items-center justify-center rounded-lg bg-white bg-linear-to-br p-24 text-[#1f464d]">
      <div className="flex h-full w-full items-center justify-center">
        <VariableFontHoverByRandomLetter
          label="Let's Go!"
          staggerDuration={0.03}
          className="flex cursor-pointer items-center justify-center rounded-full px-8 py-5 align-text-top text-4xl sm:text-5xl md:text-7xl"
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 900, 'slnt' 0"
        />
      </div>
    </div>
  ),
};
