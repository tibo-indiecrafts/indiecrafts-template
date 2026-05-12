import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud09Section } from "./index";

const meta: Meta<typeof LogoCloud09Section> = {
  title: "Sections/LogoCloud/LogoCloud09",
  component: LogoCloud09Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud09Section>;
export const Default: Story = {};
