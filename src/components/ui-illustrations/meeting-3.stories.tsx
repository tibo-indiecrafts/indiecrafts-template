import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Meeting3Illustration } from "./meeting-3";

const meta: Meta<typeof Meeting3Illustration> = {
  title: "UI Illustrations/Meeting 3",
  component: Meeting3Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Meeting3Illustration>;
export const Default: Story = {};
