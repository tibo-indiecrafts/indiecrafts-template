import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero16Section } from "./index";

const meta: Meta<typeof Hero16Section> = {
  title: "Sections/Hero/Hero16",
  component: Hero16Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero16Section>;

export const Default: Story = {};
