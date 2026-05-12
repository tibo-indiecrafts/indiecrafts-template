import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero04Section } from "./index";

const meta: Meta<typeof Hero04Section> = {
  title: "Sections/Hero/Hero04",
  component: Hero04Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero04Section>;

export const Default: Story = {};
