import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content19Section } from "./index";
import { content19Sample } from "./config";

const meta: Meta<typeof Content19Section> = {
  title: "Sections/Content/Content19",
  component: Content19Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content19Section>;

export const Default: Story = {
  args: { ...content19Sample, id: "story-content-19" } as React.ComponentProps<
    typeof Content19Section
  >,
};
