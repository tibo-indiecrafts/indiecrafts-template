import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header3 } from "./index";

const meta: Meta<typeof Header3> = {
  title: "Layouts/Shared/SiteHeaders/Header3",
  component: Header3,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Header3>;

export const Default: Story = {};
