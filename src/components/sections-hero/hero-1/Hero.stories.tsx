import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero1Section } from "./index";

const meta: Meta<typeof Hero1Section> = {
  title: "Sections/Hero/Hero1",
  component: Hero1Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero1Section>;

export const Default: Story = {};
