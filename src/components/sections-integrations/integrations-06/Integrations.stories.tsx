import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations06Section } from "./index";
import { integrations06Sample } from "./config";

const meta: Meta<typeof Integrations06Section> = {
  title: "Sections/Integrations/Integrations06",
  component: Integrations06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations06Section>;

export const Default: Story = {
  args: {
    ...integrations06Sample,
    id: "story-integrations-06",
  } as React.ComponentProps<typeof Integrations06Section>,
};
