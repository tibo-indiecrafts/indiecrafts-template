import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations13Section } from "./index";
import { integrations13Sample } from "./config";

const meta: Meta<typeof Integrations13Section> = {
  title: "Sections/Integrations/Integrations13",
  component: Integrations13Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations13Section>;
export const Default: Story = {
  args: { ...integrations13Sample, id: "story-integrations-13" } as React.ComponentProps<
    typeof Integrations13Section
  >,
};
