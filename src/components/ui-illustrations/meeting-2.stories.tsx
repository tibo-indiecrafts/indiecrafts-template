import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Meeting2Illustration } from "./meeting-2";

const meta: Meta<typeof Meeting2Illustration> = {
  title: "UI Illustrations/Meeting 2",
  component: Meeting2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Meeting2Illustration>;
export const Default: Story = {};
