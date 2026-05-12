import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Integrations from "./Integrations";
import { integrations18Sample } from "./config";

const meta: Meta<typeof Integrations> = {
  title: "Sections/Integrations/Integrations18",
  component: Integrations,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations>;

export const Default: Story = {
  args: { ...integrations18Sample, id: "integrations-18-storybook" },
};
