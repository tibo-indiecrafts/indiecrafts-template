import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero09Section } from "./index";

const meta: Meta<typeof Hero09Section> = {
  title: "Sections/Hero/Hero09",
  component: Hero09Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero09Section>;

export const Default: Story = {};
