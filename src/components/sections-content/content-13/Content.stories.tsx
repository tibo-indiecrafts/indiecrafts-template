import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content13Section } from "./index";
import { content13Sample } from "./config";

const meta: Meta<typeof Content13Section> = {
  title: "Sections/Content/Content13",
  component: Content13Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content13Section>;

export const Default: Story = {
  args: {
    ...content13Sample,
    id: "story-content-13",
  } as React.ComponentProps<typeof Content13Section>,
};
