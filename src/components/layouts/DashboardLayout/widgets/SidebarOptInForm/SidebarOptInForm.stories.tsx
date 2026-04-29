import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarOptInForm } from "./index";

const meta: Meta<typeof SidebarOptInForm> = {
  title: "Layouts/Dashboard/Widgets/SidebarOptInForm",
  component: SidebarOptInForm,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SidebarOptInForm>;

export const Default: Story = {};
