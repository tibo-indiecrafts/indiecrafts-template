import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header5 } from "./index";

const meta: Meta<typeof Header5> = {
  title: "Layouts/Shared/SiteHeaders/Header5",
  component: Header5,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header5>;

export const Default: Story = {};
