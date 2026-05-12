import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserIllustration } from "./user";

const meta: Meta<typeof UserIllustration> = {
  title: "UI Illustrations/User",
  component: UserIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof UserIllustration>;
export const Default: Story = {};
