import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud03Section } from "./index";

const meta: Meta<typeof LogoCloud03Section> = {
  title: "Sections/LogoCloud/LogoCloud03",
  component: LogoCloud03Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud03Section>;

export const Default: Story = {};
