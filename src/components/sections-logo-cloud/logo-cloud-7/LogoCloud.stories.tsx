import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud7Section } from "./index";

const meta: Meta<typeof LogoCloud7Section> = {
  title: "Sections/LogoCloud/LogoCloud7",
  component: LogoCloud7Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud7Section>;
export const Default: Story = {};
