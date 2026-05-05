import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud6Section } from "./index";

const meta: Meta<typeof LogoCloud6Section> = {
  title: "Sections/LogoCloud/LogoCloud6",
  component: LogoCloud6Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud6Section>;
export const Default: Story = {};
