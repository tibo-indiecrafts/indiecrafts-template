import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable10Section } from "./index";
import { featuresExpandable10Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable10Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable10",
  component: FeaturesExpandable10Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable10Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable10Sample,
    id: "story-features-expandable-10",
  } as React.ComponentProps<typeof FeaturesExpandable10Section>,
};
