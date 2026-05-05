import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header4 } from "./index";

const meta: Meta<typeof Header4> = {
  title: "Layouts/Shared/SiteHeaders/Header4",
  component: Header4,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header4>;

export const Default: Story = {};
