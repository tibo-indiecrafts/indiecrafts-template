import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud3Section } from "./index";

const meta: Meta<typeof LogoCloud3Section> = {
  title: "Sections/LogoCloud/LogoCloud3",
  component: LogoCloud3Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud3Section>;

export const Default: Story = {};
