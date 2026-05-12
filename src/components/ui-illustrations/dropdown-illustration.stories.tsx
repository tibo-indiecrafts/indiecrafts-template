import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropdownIllustration } from "./dropdown-illustration";

const meta: Meta<typeof DropdownIllustration> = {
  title: "UI Illustrations/Dropdown",
  component: DropdownIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DropdownIllustration>;

export const Default: Story = {};
