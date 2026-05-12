import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud08Section } from "./index";

const meta: Meta<typeof LogoCloud08Section> = {
  title: "Sections/LogoCloud/LogoCloud08",
  component: LogoCloud08Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud08Section>;
export const Default: Story = {};
