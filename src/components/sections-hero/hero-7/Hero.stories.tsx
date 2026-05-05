import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero7Section } from "./index";

const meta: Meta<typeof Hero7Section> = {
  title: "Sections/Hero/Hero7",
  component: Hero7Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero7Section>;

export const Default: Story = {};
