import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LayoutIllustration } from "./grid-1-landing-layout-illustration";

const meta: Meta<typeof LayoutIllustration> = {
  title: "UI Illustrations/Grid 1 Landing Layout",
  component: LayoutIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LayoutIllustration>;
export const Default: Story = {};
