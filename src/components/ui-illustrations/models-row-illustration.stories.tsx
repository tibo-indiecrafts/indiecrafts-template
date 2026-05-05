import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModelsRowIllustration } from "./models-row-illustration";

const meta: Meta<typeof ModelsRowIllustration> = {
  title: "UI Illustrations/ModelsRowIllustration",
  component: ModelsRowIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ModelsRowIllustration>;

export const Default: Story = {};
