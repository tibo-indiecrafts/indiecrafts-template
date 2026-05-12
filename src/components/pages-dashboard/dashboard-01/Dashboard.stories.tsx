import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dashboard } from "./Dashboard";

const meta: Meta<typeof Dashboard> = {
  title: "Pages/Dashboard/Dashboard01",
  component: Dashboard,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {};

export const UnderDefaultLayout: Story = {
  args: { layout: "default" },
};
