import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChipIllustration } from "./chip-illustration";

const meta: Meta<typeof ChipIllustration> = {
  title: "UI Illustrations/Libre Landing Chip",
  component: ChipIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ChipIllustration>;
export const Default: Story = {};
