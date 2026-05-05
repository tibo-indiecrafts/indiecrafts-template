import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TokenCounterIllustration } from "./token-counter-illustration";

const meta: Meta<typeof TokenCounterIllustration> = {
  title: "UI Illustrations/TokenCounterIllustration",
  component: TokenCounterIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TokenCounterIllustration>;

export const Default: Story = {};
