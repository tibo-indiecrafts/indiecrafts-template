import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Integrations from "./Integrations";
import { integrations14Sample } from "./config";

const meta: Meta<typeof Integrations> = {
  title: "Sections/Integrations/Integrations14",
  component: Integrations,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations>;

export const Default: Story = {
  args: { ...integrations14Sample, id: "integrations-14-storybook" },
};
