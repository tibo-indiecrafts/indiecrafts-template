import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero13Section } from "./index";

const meta: Meta<typeof Hero13Section> = {
  title: "Sections/Hero/Hero13",
  component: Hero13Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Hero13Section>;

export const Default: Story = {};
