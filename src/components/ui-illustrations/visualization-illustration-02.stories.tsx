import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MainIllustration } from "./visualization-illustration-02";

const meta: Meta<typeof MainIllustration> = {
  title: "UI Illustrations/Dark Landing Visualization",
  component: MainIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MainIllustration>;
export const Default: Story = {};
