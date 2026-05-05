import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero9Section } from "./index";

const meta: Meta<typeof Hero9Section> = {
  title: "Sections/Hero/Hero9",
  component: Hero9Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero9Section>;

export const Default: Story = {};
