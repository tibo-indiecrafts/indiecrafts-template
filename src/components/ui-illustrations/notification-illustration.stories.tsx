import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotificationIllustration } from "./notification-illustration";

const meta: Meta<typeof NotificationIllustration> = {
  title: "UI Illustrations/Notification",
  component: NotificationIllustration,
  parameters: { layout: "centered" },
  args: { variant: "elevated" },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["elevated", "outlined", "mixed"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof NotificationIllustration>;

export const Default: Story = {};
export const Outlined: Story = { args: { variant: "outlined" } };
export const Mixed: Story = { args: { variant: "mixed" } };
