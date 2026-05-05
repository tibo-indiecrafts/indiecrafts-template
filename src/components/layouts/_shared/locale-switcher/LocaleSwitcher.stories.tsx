import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LocaleSwitcher } from "./index";

const meta: Meta<typeof LocaleSwitcher> = {
  title: "Layouts/Shared/LocaleSwitcher",
  component: LocaleSwitcher,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/en" },
    },
  },
};
export default meta;

type Story = StoryObj<typeof LocaleSwitcher>;

export const Default: Story = {};
