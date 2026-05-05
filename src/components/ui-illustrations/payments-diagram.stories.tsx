import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaymentsDiagram } from "./payments-diagram";

const meta: Meta<typeof PaymentsDiagram> = {
  title: "UI Illustrations/PaymentsDiagram",
  component: PaymentsDiagram,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PaymentsDiagram>;

export const Default: Story = {};
