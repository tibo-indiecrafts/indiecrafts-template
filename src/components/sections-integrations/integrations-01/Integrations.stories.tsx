import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations01Section } from "./index";
import { integrations01Sample } from "./config";

const meta: Meta<typeof Integrations01Section> = {
  title: "Sections/Integrations/Integrations01",
  component: Integrations01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations01Section>;

export const Default: Story = {
  args: {
    ...integrations01Sample,
    id: "story-integrations-01",
  } as React.ComponentProps<typeof Integrations01Section>,
};
