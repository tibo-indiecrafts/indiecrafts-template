import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header6 } from "./index";

const meta: Meta<typeof Header6> = {
  title: "Layouts/Shared/SiteHeaders/Header6",
  component: Header6,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header6>;

export const Default: Story = {};
