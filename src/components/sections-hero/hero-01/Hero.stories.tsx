import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero01Section } from "./index";

const meta: Meta<typeof Hero01Section> = {
  title: "Sections/Hero/Hero01",
  component: Hero01Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero01Section>;

export const Default: Story = {};
