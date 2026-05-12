import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IntegrationsIllustration } from "./integrations-illustration-02";

const meta: Meta<typeof IntegrationsIllustration> = {
  title: "UI Illustrations/Grid 1 Landing Integrations",
  component: IntegrationsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof IntegrationsIllustration>;
export const Default: Story = {};
