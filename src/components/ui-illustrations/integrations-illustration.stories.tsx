import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IntegrationsIllustration } from "./integrations-illustration";

const meta: Meta<typeof IntegrationsIllustration> = {
  title: "UI Illustrations/IntegrationsIllustration",
  component: IntegrationsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof IntegrationsIllustration>;

export const Default: Story = {};
