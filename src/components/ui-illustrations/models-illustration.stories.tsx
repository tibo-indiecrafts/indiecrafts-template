import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModelsIllustration } from "./models-illustration";

const meta: Meta<typeof ModelsIllustration> = {
  title: "UI Illustrations/Models",
  component: ModelsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ModelsIllustration>;

export const Default: Story = {};
