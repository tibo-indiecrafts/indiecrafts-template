import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations12Section } from "./index";
import { integrations12Sample } from "./config";

const meta: Meta<typeof Integrations12Section> = {
  title: "Sections/Integrations/Integrations12",
  component: Integrations12Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations12Section>;

export const Default: Story = {
  args: { ...integrations12Sample, id: "story-integrations-12" } as React.ComponentProps<
    typeof Integrations12Section
  >,
};
