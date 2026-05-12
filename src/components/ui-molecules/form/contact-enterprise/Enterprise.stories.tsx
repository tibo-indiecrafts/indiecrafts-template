import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EnterpriseForm } from "./index";

const meta: Meta<typeof EnterpriseForm> = {
  title: "UI Molecules/Form/ContactEnterprise",
  component: EnterpriseForm,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof EnterpriseForm>;

export const Default: Story = {};
