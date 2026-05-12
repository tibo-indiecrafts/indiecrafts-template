import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud04Section } from "./index";

const meta: Meta<typeof LogoCloud04Section> = {
  title: "Sections/LogoCloud/LogoCloud04",
  component: LogoCloud04Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud04Section>;

export const Default: Story = {};
