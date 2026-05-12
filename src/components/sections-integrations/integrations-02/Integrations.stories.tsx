import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations02Section } from "./index";
import { integrations02Sample } from "./config";

const meta: Meta<typeof Integrations02Section> = {
  title: "Sections/Integrations/Integrations02",
  component: Integrations02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations02Section>;

export const Default: Story = {
  args: {
    ...integrations02Sample,
    id: "story-integrations-02",
  } as React.ComponentProps<typeof Integrations02Section>,
};
