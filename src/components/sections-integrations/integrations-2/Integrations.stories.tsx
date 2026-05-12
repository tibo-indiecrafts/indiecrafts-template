import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations2Section } from "./index";
import { integrations2Sample } from "./config";

const meta: Meta<typeof Integrations2Section> = {
  title: "Sections/Integrations/Integrations2",
  component: Integrations2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations2Section>;

export const Default: Story = {
  args: {
    ...integrations2Sample,
    id: "story-integrations-2",
  } as React.ComponentProps<typeof Integrations2Section>,
};
