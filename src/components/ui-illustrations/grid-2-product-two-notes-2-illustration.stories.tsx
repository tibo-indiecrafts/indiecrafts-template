import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Notes2Illustration } from "./grid-2-product-two-notes-2-illustration";

const meta: Meta<typeof Notes2Illustration> = {
  title: "UI Illustrations/Grid 2 Product Two Notes 2",
  component: Notes2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Notes2Illustration>;
export const Default: Story = {};
