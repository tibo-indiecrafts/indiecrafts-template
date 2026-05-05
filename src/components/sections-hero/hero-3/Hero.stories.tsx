import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero3Section } from "./index";

const meta: Meta<typeof Hero3Section> = {
  title: "Sections/Hero/Hero3",
  component: Hero3Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero3Section>;

export const Default: Story = {};
