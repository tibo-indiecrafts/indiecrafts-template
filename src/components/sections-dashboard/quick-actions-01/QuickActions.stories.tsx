import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import QuickActionsSection from "./QuickActions";
import { quickActions01Items, quickActions01Sample } from "./config";

const meta: Meta<typeof QuickActionsSection> = {
  title: "Sections/Dashboard/QuickActions01",
  component: QuickActionsSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof QuickActionsSection>;

export const Default: Story = {
  args: { ...quickActions01Sample, id: "quick-actions-01-default" },
};

export const Compact: Story = {
  args: {
    id: "quick-actions-01-compact",
    actions: [quickActions01Items[0]!, quickActions01Items[1]!],
  },
};
