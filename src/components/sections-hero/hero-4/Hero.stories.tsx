import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero4Section } from "./index";

const meta: Meta<typeof Hero4Section> = {
  title: "Sections/Hero/Hero4",
  component: Hero4Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero4Section>;

export const Default: Story = {};
