import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero14Section } from "./index";

const meta: Meta<typeof Hero14Section> = {
  title: "Sections/Hero/Hero14",
  component: Hero14Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero14Section>;

export const Default: Story = {};
