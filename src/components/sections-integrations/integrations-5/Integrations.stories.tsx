import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations5Section } from "./index";
import { integrations5Sample } from "./config";

const meta: Meta<typeof Integrations5Section> = {
  title: "Sections/Integrations/Integrations5",
  component: Integrations5Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations5Section>;

export const Default: Story = {
  args: {
    ...integrations5Sample,
    id: "story-integrations-5",
  } as React.ComponentProps<typeof Integrations5Section>,
};
