import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero2Section } from "./index";

const meta: Meta<typeof Hero2Section> = {
  title: "Sections/Hero/Hero2",
  component: Hero2Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero2Section>;

export const Default: Story = {};
