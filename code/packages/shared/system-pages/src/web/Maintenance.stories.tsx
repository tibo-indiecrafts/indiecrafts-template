import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Maintenance } from "./Maintenance";

const meta = {
  title: "Web/System Pages/Maintenance",
  component: Maintenance,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    statusLabel: "Scheduled maintenance",
    title: "We'll be right back",
    body: "We're making some improvements and will be back online shortly. Thanks for your patience.",
    contactLabel: "Questions?",
    name: "Acme",
    email: "hello@acme.dev",
  },
} satisfies Meta<typeof Maintenance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoEmail: Story = { args: { email: undefined } };
