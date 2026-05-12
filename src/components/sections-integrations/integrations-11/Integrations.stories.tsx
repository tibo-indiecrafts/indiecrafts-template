import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations11Section } from "./index";
import { integrations11Sample } from "./config";

const meta: Meta<typeof Integrations11Section> = {
  title: "Sections/Integrations/Integrations11",
  component: Integrations11Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations11Section>;

export const Default: Story = {
  args: {
    ...integrations11Sample,
    id: "story-integrations-11",
  } as React.ComponentProps<typeof Integrations11Section>,
};
