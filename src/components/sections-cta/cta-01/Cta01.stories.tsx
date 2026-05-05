import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CallToActionSection } from "./index";
import { cta01Sample } from "./config";

const meta: Meta<typeof CallToActionSection> = {
  title: "Sections/Cta/Cta01",
  component: CallToActionSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CallToActionSection>;

export const Default: Story = {
  args: { ...cta01Sample, id: "story-cta-01" } as React.ComponentProps<
    typeof CallToActionSection
  >,
};
