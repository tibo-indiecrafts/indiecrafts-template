import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TriangleAlertIcon, CreditCardIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import docs from "./alert.md?raw";

const meta = {
  title: "Web/UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-md">
      <TriangleAlertIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        Your trial ends in 3 days. Upgrade to keep your projects.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-md">
      <CreditCardIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        We could not process your card. Update your billing details to continue.
      </AlertDescription>
    </Alert>
  ),
};
