import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud5Section } from "./index";

const meta: Meta<typeof LogoCloud5Section> = {
  title: "Sections/LogoCloud/LogoCloud5",
  component: LogoCloud5Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud5Section>;

export const Default: Story = {};
