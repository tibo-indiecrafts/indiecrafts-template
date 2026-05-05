import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header7 } from "./index";

const meta: Meta<typeof Header7> = {
  title: "Layouts/Shared/SiteHeaders/Header7",
  component: Header7,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header7>;

export const Default: Story = {};
