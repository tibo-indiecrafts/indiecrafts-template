import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Integrations from "./Integrations";
import { integrations15Sample } from "./config";

const meta: Meta<typeof Integrations> = {
  title: "Sections/Integrations/Integrations15",
  component: Integrations,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations>;

export const Default: Story = {
  args: { ...integrations15Sample, id: "integrations-15-storybook" },
};
