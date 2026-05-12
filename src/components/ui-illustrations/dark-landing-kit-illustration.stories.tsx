import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KitIllustration } from "./dark-landing-kit-illustration";

const meta: Meta<typeof KitIllustration> = {
  title: "UI Illustrations/Dark Landing Kit",
  component: KitIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof KitIllustration>;
export const Default: Story = {};
