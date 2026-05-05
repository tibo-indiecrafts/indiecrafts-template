import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable22Section } from "./index";
import { featuresExpandable22Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable22Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable22",
  component: FeaturesExpandable22Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable22Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable22Sample,
    id: "story-features-expandable-22",
  } as React.ComponentProps<typeof FeaturesExpandable22Section>,
};
