import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable07Section } from "./index";
import { featuresExpandable07Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable07Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable07",
  component: FeaturesExpandable07Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable07Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable07Sample,
    id: "story-features-expandable-07",
  } as React.ComponentProps<typeof FeaturesExpandable07Section>,
};
