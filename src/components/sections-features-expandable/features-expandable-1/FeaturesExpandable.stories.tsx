import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable1Section } from "./index";
import { featuresExpandable1Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable1Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable1",
  component: FeaturesExpandable1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable1Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable1Sample,
    id: "story-features-expandable-1",
  } as React.ComponentProps<typeof FeaturesExpandable1Section>,
};
