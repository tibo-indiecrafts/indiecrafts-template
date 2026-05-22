import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VariableFontHoverByLetter } from "./index";

const meta: Meta<typeof VariableFontHoverByLetter> = {
  title: "UI Effects/Text/VariableFontHoverByLetter",
  component: VariableFontHoverByLetter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof VariableFontHoverByLetter>;

export const Showcase: Story = {
  render: () => (
    <div className="bg-foreground text-muted xs:text-sm flex h-dvh w-dvw flex-col items-center justify-center rounded-lg sm:text-xl md:text-2xl xl:text-3xl dark:text-white">
      <div className="w-full items-center justify-start p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="w-3/4">
          <h2>OPEN ROLES ✽</h2>
          <ul className="mt-6 flex h-full cursor-pointer flex-col space-y-1 md:mt-12">
            <VariableFontHoverByLetter
              label="DESIGN ENGINEER (US)"
              staggerDuration={0.03}
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
            />
            <VariableFontHoverByLetter
              label="PRODUCT DESIGNER (US/UK)"
              staggerDuration={0}
              transition={{ duration: 1, type: "spring" }}
              fromFontVariationSettings="'wght' 400, 'slnt' -10"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
            />
            <VariableFontHoverByLetter
              label="ENGINEERING MANAGER (US)"
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
              staggerFrom="last"
            />
            <VariableFontHoverByLetter
              label="SALES ENGINEER (US)"
              staggerFrom="center"
              fromFontVariationSettings="'wght' 400, 'slnt' 0"
              toFontVariationSettings="'wght' 900, 'slnt' -10"
            />
          </ul>
        </div>
      </div>
    </div>
  ),
};
