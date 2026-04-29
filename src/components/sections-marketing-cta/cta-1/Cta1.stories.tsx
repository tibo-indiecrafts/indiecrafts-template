import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CallToActionSection } from "./index";
import { cta1Sample } from "./config";

const meta: Meta<typeof CallToActionSection> = {
  title: "Sections/Marketing/Cta/Cta1",
  component: CallToActionSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CallToActionSection>;

export const Default: Story = {
  args: { ...cta1Sample, id: "story-cta-1" } as React.ComponentProps<
    typeof CallToActionSection
  >,
};
