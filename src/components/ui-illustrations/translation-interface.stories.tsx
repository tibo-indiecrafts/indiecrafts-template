import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TranslationInterfaceIllustration } from "./translation-interface";

const meta: Meta<typeof TranslationInterfaceIllustration> = {
  title: "UI Illustrations/Translation Interface",
  component: TranslationInterfaceIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TranslationInterfaceIllustration>;
export const Default: Story = {};
