import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud4Section } from "./index";

const meta: Meta<typeof LogoCloud4Section> = {
  title: "Sections/LogoCloud/LogoCloud4",
  component: LogoCloud4Section,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud4Section>;

export const Default: Story = {};
