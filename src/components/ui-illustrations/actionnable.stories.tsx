import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionnableIllustration } from "./actionnable";

const meta: Meta<typeof ActionnableIllustration> = {
  title: "UI Illustrations/Actionnable",
  component: ActionnableIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ActionnableIllustration>;
export const Default: Story = {};
