import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dashboard } from "./Dashboard";

const meta: Meta<typeof Dashboard> = {
  title: "Pages/Dashboard/Dashboard01",
  component: Dashboard,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Dashboard>;

/** Defaults — DashboardLayout (Sidebar07 + DashboardHeader + main). */
export const Default: Story = {};

/** Same content under marketing chrome — useful as a public preview. */
export const UnderDefaultLayout: Story = {
  args: { layout: "default" },
};
