import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content20Section } from "./index";
import { content20Sample } from "./config";

const meta: Meta<typeof Content20Section> = {
  title: "Sections/Content/Content20",
  component: Content20Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content20Section>;
export const Default: Story = {
  args: { ...content20Sample, id: "story-content-20" } as React.ComponentProps<
    typeof Content20Section
  >,
};
