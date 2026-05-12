import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero03Section } from "./index";

const meta: Meta<typeof Hero03Section> = {
  title: "Sections/Hero/Hero03",
  component: Hero03Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero03Section>;

export const Default: Story = {};
