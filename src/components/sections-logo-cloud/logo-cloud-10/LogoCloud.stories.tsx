import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud10Section } from "./index";

const meta: Meta<typeof LogoCloud10Section> = {
  title: "Sections/LogoCloud/LogoCloud10",
  component: LogoCloud10Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud10Section>;
export const Default: Story = {};
