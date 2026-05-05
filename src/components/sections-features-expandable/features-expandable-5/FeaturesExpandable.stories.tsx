import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable5Section } from "./index";
import { featuresExpandable5Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable5Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable5",
  component: FeaturesExpandable5Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable5Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable5Sample,
    id: "story-features-expandable-5",
  } as React.ComponentProps<typeof FeaturesExpandable5Section>,
};
