import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content18Section } from "./index";
import { content18Sample } from "./config";

const meta: Meta<typeof Content18Section> = {
  title: "Sections/Content/Content18",
  component: Content18Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content18Section>;

export const Default: Story = {
  args: {
    ...content18Sample,
    id: "story-content-18",
  } as React.ComponentProps<typeof Content18Section>,
};
