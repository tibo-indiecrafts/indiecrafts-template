import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud07Section } from "./index";

const meta: Meta<typeof LogoCloud07Section> = {
  title: "Sections/LogoCloud/LogoCloud07",
  component: LogoCloud07Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud07Section>;
export const Default: Story = {};
