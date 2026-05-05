import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero6Section } from "./index";

const meta: Meta<typeof Hero6Section> = {
  title: "Sections/Hero/Hero6",
  component: Hero6Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero6Section>;

export const Default: Story = {};
