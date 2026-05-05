import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header1 } from "./index";

const meta: Meta<typeof Header1> = {
  title: "Layouts/Shared/SiteHeaders/Header1",
  component: Header1,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header1>;

export const Default: Story = {};
