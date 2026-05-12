import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileNote2Illustration } from "./mobile-note-2";

const meta: Meta<typeof MobileNote2Illustration> = {
  title: "UI Illustrations/Mobile Note 2",
  component: MobileNote2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileNote2Illustration>;
export const Default: Story = {};
