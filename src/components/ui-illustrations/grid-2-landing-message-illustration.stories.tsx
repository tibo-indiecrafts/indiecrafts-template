import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageIllustration } from "./grid-2-landing-message-illustration";

const meta: Meta<typeof MessageIllustration> = {
  title: "UI Illustrations/Grid 2 Landing Message",
  component: MessageIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MessageIllustration>;
export const Default: Story = {};
