import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero5Section } from "./index";

const meta: Meta<typeof Hero5Section> = {
  title: "Sections/Hero/Hero5",
  component: Hero5Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero5Section>;

export const Default: Story = {};
