import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable7Section } from "./index";
import { featuresExpandable7Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable7Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable7",
  component: FeaturesExpandable7Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable7Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable7Sample,
    id: "story-features-expandable-7",
  } as React.ComponentProps<typeof FeaturesExpandable7Section>,
};
