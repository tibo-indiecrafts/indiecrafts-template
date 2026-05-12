import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud05Section } from "./index";

const meta: Meta<typeof LogoCloud05Section> = {
  title: "Sections/LogoCloud/LogoCloud05",
  component: LogoCloud05Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud05Section>;

export const Default: Story = {};
