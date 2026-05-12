import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations10Section } from "./index";
import { integrations10Sample } from "./config";

const meta: Meta<typeof Integrations10Section> = {
  title: "Sections/Integrations/Integrations10",
  component: Integrations10Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations10Section>;

export const Default: Story = {
  args: {
    ...integrations10Sample,
    id: "story-integrations-10",
  } as React.ComponentProps<typeof Integrations10Section>,
};
