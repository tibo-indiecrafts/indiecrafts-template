import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroIllustration } from "./hero-illustration-02";

const meta: Meta<typeof HeroIllustration> = {
  title: "UI Illustrations/Libre Landing Hero",
  component: HeroIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof HeroIllustration>;
export const Default: Story = {};
