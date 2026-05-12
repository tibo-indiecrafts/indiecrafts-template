import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Integrations from "./Integrations";
import { integrations17Sample } from "./config";

const meta: Meta<typeof Integrations> = {
  title: "Sections/Integrations/Integrations17",
  component: Integrations,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations>;

export const Default: Story = {
  args: { ...integrations17Sample, id: "integrations-17-storybook" },
};
