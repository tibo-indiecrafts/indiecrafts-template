import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Integrations from "./Integrations";
import { integrations16Sample } from "./config";

const meta: Meta<typeof Integrations> = {
  title: "Sections/Integrations/Integrations16",
  component: Integrations,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Integrations>;

export const Default: Story = {
  args: { ...integrations16Sample, id: "integrations-16-storybook" },
};
