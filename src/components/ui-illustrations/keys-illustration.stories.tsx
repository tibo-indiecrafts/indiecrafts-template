import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KeysIllustration } from "./keys-illustration";

const meta: Meta<typeof KeysIllustration> = {
  title: "UI Illustrations/KeysIllustration",
  component: KeysIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof KeysIllustration>;

export const Default: Story = {};
