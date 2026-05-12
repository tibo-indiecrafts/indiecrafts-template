import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations1Section } from "./index";
import { integrations1Sample } from "./config";

const meta: Meta<typeof Integrations1Section> = {
  title: "Sections/Integrations/Integrations1",
  component: Integrations1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations1Section>;

export const Default: Story = {
  args: {
    ...integrations1Sample,
    id: "story-integrations-1",
  } as React.ComponentProps<typeof Integrations1Section>,
};
