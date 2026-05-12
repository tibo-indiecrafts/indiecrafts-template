import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations09Section } from "./index";
import { integrations09Sample } from "./config";

const meta: Meta<typeof Integrations09Section> = {
  title: "Sections/Integrations/Integrations09",
  component: Integrations09Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations09Section>;

export const Default: Story = {
  args: {
    ...integrations09Sample,
    id: "story-integrations-09",
  } as React.ComponentProps<typeof Integrations09Section>,
};
