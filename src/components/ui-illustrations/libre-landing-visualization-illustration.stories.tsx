import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MainIllustration } from "./libre-landing-visualization-illustration";

const meta: Meta<typeof MainIllustration> = {
  title: "UI Illustrations/Libre Landing Visualization",
  component: MainIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MainIllustration>;
export const Default: Story = {};
