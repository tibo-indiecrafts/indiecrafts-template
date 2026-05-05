import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud8Section } from "./index";

const meta: Meta<typeof LogoCloud8Section> = {
  title: "Sections/LogoCloud/LogoCloud8",
  component: LogoCloud8Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud8Section>;
export const Default: Story = {};
