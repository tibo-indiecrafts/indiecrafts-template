import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations6Section } from "./index";
import { integrations6Sample } from "./config";

const meta: Meta<typeof Integrations6Section> = {
  title: "Sections/Integrations/Integrations6",
  component: Integrations6Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations6Section>;

export const Default: Story = {
  args: {
    ...integrations6Sample,
    id: "story-integrations-6",
  } as React.ComponentProps<typeof Integrations6Section>,
};
