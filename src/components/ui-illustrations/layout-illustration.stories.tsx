import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LayoutIllustration } from "./layout-illustration";

const meta: Meta<typeof LayoutIllustration> = {
  title: "UI Illustrations/LayoutIllustration",
  component: LayoutIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LayoutIllustration>;

export const Default: Story = {};
