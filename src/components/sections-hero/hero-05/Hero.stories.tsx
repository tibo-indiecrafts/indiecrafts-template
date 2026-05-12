import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero05Section } from "./index";

const meta: Meta<typeof Hero05Section> = {
  title: "Sections/Hero/Hero05",
  component: Hero05Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero05Section>;

export const Default: Story = {};
