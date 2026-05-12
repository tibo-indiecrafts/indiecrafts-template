import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero07Section } from "./index";

const meta: Meta<typeof Hero07Section> = {
  title: "Sections/Hero/Hero07",
  component: Hero07Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero07Section>;

export const Default: Story = {};
