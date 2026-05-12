import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KitStackIllustration } from "./kit-stack-illustration";

const meta: Meta<typeof KitStackIllustration> = {
  title: "UI Illustrations/KitStack",
  component: KitStackIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof KitStackIllustration>;

export const Default: Story = {};
