import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero12Section } from "./index";

const meta: Meta<typeof Hero12Section> = {
  title: "Sections/Hero/Hero12",
  component: Hero12Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero12Section>;

export const Default: Story = {};
