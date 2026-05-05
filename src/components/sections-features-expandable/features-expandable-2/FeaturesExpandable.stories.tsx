import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable2Section } from "./index";
import { featuresExpandable2Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable2Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable2",
  component: FeaturesExpandable2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable2Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable2Sample,
    id: "story-features-expandable-2",
  } as React.ComponentProps<typeof FeaturesExpandable2Section>,
};
