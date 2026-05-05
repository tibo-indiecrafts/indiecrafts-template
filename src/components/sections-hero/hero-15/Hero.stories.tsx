import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero15Section } from "./index";

const meta: Meta<typeof Hero15Section> = {
  title: "Sections/Hero/Hero15",
  component: Hero15Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero15Section>;

export const Default: Story = {};
