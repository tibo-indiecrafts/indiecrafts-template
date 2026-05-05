import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable14Section } from "./index";
import { featuresExpandable14Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable14Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable14",
  component: FeaturesExpandable14Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable14Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable14Sample,
    id: "story-features-expandable-14",
  } as React.ComponentProps<typeof FeaturesExpandable14Section>,
};
