import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlowCardsIllustration } from "./flow-cards-illustration";

const meta: Meta<typeof FlowCardsIllustration> = {
  title: "UI Illustrations/FlowCardsIllustration",
  component: FlowCardsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FlowCardsIllustration>;

export const Default: Story = {};
