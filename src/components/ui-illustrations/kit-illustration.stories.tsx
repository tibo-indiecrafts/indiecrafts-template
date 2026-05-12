import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KitIllustration } from "./kit-illustration";

const meta: Meta<typeof KitIllustration> = {
  title: "UI Illustrations/Kit",
  component: KitIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof KitIllustration>;

export const Default: Story = {};
