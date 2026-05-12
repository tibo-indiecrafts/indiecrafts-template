import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero02Section } from "./index";

const meta: Meta<typeof Hero02Section> = {
  title: "Sections/Hero/Hero02",
  component: Hero02Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero02Section>;

export const Default: Story = {};
