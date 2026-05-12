import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileEmailIllustration } from "./mobile-email";

const meta: Meta<typeof MobileEmailIllustration> = {
  title: "UI Illustrations/Mobile Email",
  component: MobileEmailIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileEmailIllustration>;
export const Default: Story = {};
