import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageIllustration } from "./libre-landing-message-illustration";

const meta: Meta<typeof MessageIllustration> = {
  title: "UI Illustrations/Libre Landing Message",
  component: MessageIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MessageIllustration>;
export const Default: Story = {};
