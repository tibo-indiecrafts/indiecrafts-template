import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TranslationIllustration } from "./translation-illustration";

const meta: Meta<typeof TranslationIllustration> = {
  title: "UI Illustrations/Translation",
  component: TranslationIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TranslationIllustration>;

export const Default: Story = {};
