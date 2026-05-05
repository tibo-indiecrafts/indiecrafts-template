import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero11Section } from "./index";

const meta: Meta<typeof Hero11Section> = {
  title: "Sections/Hero/Hero11",
  component: Hero11Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero11Section>;

export const Default: Story = {};
