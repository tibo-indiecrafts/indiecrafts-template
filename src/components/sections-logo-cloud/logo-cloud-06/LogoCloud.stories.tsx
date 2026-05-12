import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LogoCloud06Section } from "./index";

const meta: Meta<typeof LogoCloud06Section> = {
  title: "Sections/LogoCloud/LogoCloud06",
  component: LogoCloud06Section,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/en" } },
  },
};
export default meta;

type Story = StoryObj<typeof LogoCloud06Section>;
export const Default: Story = {};
