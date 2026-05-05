import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud9Section } from "./index";

const meta: Meta<typeof LogoCloud9Section> = {
  title: "Sections/LogoCloud/LogoCloud9",
  component: LogoCloud9Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud9Section>;
export const Default: Story = {};
