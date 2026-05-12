import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations9Section } from "./index";
import { integrations9Sample } from "./config";

const meta: Meta<typeof Integrations9Section> = {
  title: "Sections/Integrations/Integrations9",
  component: Integrations9Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations9Section>;

export const Default: Story = {
  args: {
    ...integrations9Sample,
    id: "story-integrations-9",
  } as React.ComponentProps<typeof Integrations9Section>,
};
