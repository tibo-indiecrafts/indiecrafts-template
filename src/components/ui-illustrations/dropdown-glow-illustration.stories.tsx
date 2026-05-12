import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropdownGlowIllustration } from "./dropdown-glow-illustration";

const meta: Meta<typeof DropdownGlowIllustration> = {
  title: "UI Illustrations/DropdownGlow",
  component: DropdownGlowIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DropdownGlowIllustration>;

export const Default: Story = {};
