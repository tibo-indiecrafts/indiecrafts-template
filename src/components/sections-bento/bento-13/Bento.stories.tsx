import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bento13Section } from "./index";
import { bento13Sample } from "./config";

const meta: Meta<typeof Bento13Section> = {
  title: "Sections/Bento/Bento13",
  component: Bento13Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Bento13Section>;

export const Default: Story = {
  args: {
    ...bento13Sample,
    id: "story-bento-13",
  } as React.ComponentProps<typeof Bento13Section>,
};
