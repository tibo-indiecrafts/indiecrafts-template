import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModelTrainingIllustration } from "./model-training";

const meta: Meta<typeof ModelTrainingIllustration> = {
  title: "UI Illustrations/Model Training",
  component: ModelTrainingIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ModelTrainingIllustration>;
export const Default: Story = {};
