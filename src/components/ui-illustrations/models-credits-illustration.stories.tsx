import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModelsCreditsIllustration } from "./models-credits-illustration";

const meta: Meta<typeof ModelsCreditsIllustration> = {
  title: "UI Illustrations/ModelsCredits",
  component: ModelsCreditsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ModelsCreditsIllustration>;

export const Default: Story = {};
