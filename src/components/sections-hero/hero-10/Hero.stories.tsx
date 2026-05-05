import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero10Section } from "./index";

const meta: Meta<typeof Hero10Section> = {
  title: "Sections/Hero/Hero10",
  component: Hero10Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero10Section>;

export const Default: Story = {};
