import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header8 } from "./index";

const meta: Meta<typeof Header8> = {
  title: "Layouts/Shared/SiteHeaders/Header8",
  component: Header8,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header8>;

export const Default: Story = {};
