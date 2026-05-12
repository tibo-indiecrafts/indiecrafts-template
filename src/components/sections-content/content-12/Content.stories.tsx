import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content12Section } from "./index";
import { content12Sample } from "./config";

const meta: Meta<typeof Content12Section> = {
  title: "Sections/Content/Content12",
  component: Content12Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content12Section>;

export const Default: Story = {
  args: {
    ...content12Sample,
    id: "story-content-12",
  } as React.ComponentProps<typeof Content12Section>,
};
