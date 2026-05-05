import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero8Section } from "./index";

const meta: Meta<typeof Hero8Section> = {
  title: "Sections/Hero/Hero8",
  component: Hero8Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero8Section>;

export const Default: Story = {};
