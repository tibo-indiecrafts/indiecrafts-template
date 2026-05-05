import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content10Section } from "./index";
import { content10Sample } from "./config";

const meta: Meta<typeof Content10Section> = {
  title: "Sections/Content/Content10",
  component: Content10Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content10Section>;

export const Default: Story = {
  args: { ...content10Sample, id: "story-content-10" } as React.ComponentProps<
    typeof Content10Section
  >,
};
