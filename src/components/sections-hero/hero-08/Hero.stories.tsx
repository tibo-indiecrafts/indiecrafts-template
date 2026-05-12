import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero08Section } from "./index";

const meta: Meta<typeof Hero08Section> = {
  title: "Sections/Hero/Hero08",
  component: Hero08Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero08Section>;

export const Default: Story = {};
