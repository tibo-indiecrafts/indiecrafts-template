import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content05Section } from "./index";
import { content05Sample } from "./config";

const meta: Meta<typeof Content05Section> = {
  title: "Sections/Content/Content05",
  component: Content05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content05Section>;

export const Default: Story = {
  args: { ...content05Sample, id: "story-content-05" } as React.ComponentProps<
    typeof Content05Section
  >,
};
