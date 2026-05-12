import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations7Section } from "./index";
import { integrations7Sample } from "./config";

const meta: Meta<typeof Integrations7Section> = {
  title: "Sections/Integrations/Integrations7",
  component: Integrations7Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations7Section>;

export const Default: Story = {
  args: {
    ...integrations7Sample,
    id: "story-integrations-7",
  } as React.ComponentProps<typeof Integrations7Section>,
};
