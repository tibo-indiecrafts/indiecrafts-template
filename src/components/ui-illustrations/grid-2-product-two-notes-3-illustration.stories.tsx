import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Notes3Illustration } from "./grid-2-product-two-notes-3-illustration";

const meta: Meta<typeof Notes3Illustration> = {
  title: "UI Illustrations/Grid 2 Product Two Notes 3",
  component: Notes3Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Notes3Illustration>;
export const Default: Story = {};
