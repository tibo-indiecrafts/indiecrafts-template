import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ModelSelectorIllustration } from "./model-selector";

const meta: Meta<typeof ModelSelectorIllustration> = {
  title: "UI Illustrations/Model Selector",
  component: ModelSelectorIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ModelSelectorIllustration>;
export const Default: Story = {};
