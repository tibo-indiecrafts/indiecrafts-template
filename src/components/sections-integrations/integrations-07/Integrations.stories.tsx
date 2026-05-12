import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations07Section } from "./index";
import { integrations07Sample } from "./config";

const meta: Meta<typeof Integrations07Section> = {
  title: "Sections/Integrations/Integrations07",
  component: Integrations07Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations07Section>;

export const Default: Story = {
  args: {
    ...integrations07Sample,
    id: "story-integrations-07",
  } as React.ComponentProps<typeof Integrations07Section>,
};
