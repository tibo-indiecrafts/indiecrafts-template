import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud2Section } from "./index";

const meta: Meta<typeof LogoCloud2Section> = {
  title: "Sections/LogoCloud/LogoCloud2",
  component: LogoCloud2Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud2Section>;

export const Default: Story = {};
