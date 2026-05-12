import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations05Section } from "./index";
import { integrations05Sample } from "./config";

const meta: Meta<typeof Integrations05Section> = {
  title: "Sections/Integrations/Integrations05",
  component: Integrations05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations05Section>;

export const Default: Story = {
  args: {
    ...integrations05Sample,
    id: "story-integrations-05",
  } as React.ComponentProps<typeof Integrations05Section>,
};
