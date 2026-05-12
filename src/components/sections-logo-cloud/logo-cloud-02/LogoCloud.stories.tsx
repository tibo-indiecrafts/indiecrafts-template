import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud02Section } from "./index";

const meta: Meta<typeof LogoCloud02Section> = {
  title: "Sections/LogoCloud/LogoCloud02",
  component: LogoCloud02Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud02Section>;

export const Default: Story = {};
