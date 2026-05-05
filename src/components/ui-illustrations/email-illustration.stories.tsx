import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmailIllustration } from "./email-illustration";

const meta: Meta<typeof EmailIllustration> = {
  title: "UI Illustrations/EmailIllustration",
  component: EmailIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof EmailIllustration>;

export const Default: Story = {};
