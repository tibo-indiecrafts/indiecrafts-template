import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardInfoIllustration } from "./mobile-card-form";

const meta: Meta<typeof CardInfoIllustration> = {
  title: "UI Illustrations/Mobile Card Form",
  component: CardInfoIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CardInfoIllustration>;
export const Default: Story = {};
