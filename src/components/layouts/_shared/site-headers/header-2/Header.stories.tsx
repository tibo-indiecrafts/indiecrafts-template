import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header2 } from "./index";

const meta: Meta<typeof Header2> = {
  title: "Layouts/Shared/SiteHeaders/Header2",
  component: Header2,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header2>;

export const Default: Story = {};
