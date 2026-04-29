import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dashboard1 } from "./Dashboard1";

const meta: Meta<typeof Dashboard1> = {
  title: "Pages/App/Dashboard1",
  component: Dashboard1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Dashboard1>;

/** Defaults — DashboardLayout (AppSidebar + DashboardHeader + main). */
export const Default: Story = {};

/** Same content under marketing chrome — useful as a public preview. */
export const UnderDefaultLayout: Story = {
  args: { layout: "default" },
};
