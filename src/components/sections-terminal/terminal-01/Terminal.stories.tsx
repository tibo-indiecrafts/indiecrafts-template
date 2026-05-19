import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { terminal01Sample } from "./config";
import { Terminal01Section } from "./index";

const meta: Meta<typeof Terminal01Section> = {
  title: "Sections/Terminal/Terminal01",
  component: Terminal01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Terminal01Section>;

export const Default: Story = {
  args: {
    ...terminal01Sample,
    id: "story-terminal-01",
  } as React.ComponentProps<typeof Terminal01Section>,
};
