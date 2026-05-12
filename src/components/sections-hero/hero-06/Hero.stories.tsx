import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero06Section } from "./index";

const meta: Meta<typeof Hero06Section> = {
  title: "Sections/Hero/Hero06",
  component: Hero06Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero06Section>;

export const Default: Story = {};
