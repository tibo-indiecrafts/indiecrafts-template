import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import QuickActionsSection from "./QuickActions";
import { quickActions01Items, quickActions01Sample } from "./config";

const meta: Meta<typeof QuickActionsSection> = {
  title: "Sections/Dashboard/QuickActions01",
  component: QuickActionsSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-6xl pt-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof QuickActionsSection>;

/** Default — 4 actions in a responsive 1/2/4 column grid. */
export const Default: Story = {
  args: { ...quickActions01Sample, id: "quick-actions-01-default" },
};

/** Compact — 2 actions, useful for trimmed dashboards or empty workspaces. */
export const Compact: Story = {
  args: {
    id: "quick-actions-01-compact",
    actions: [quickActions01Items[0]!, quickActions01Items[1]!],
  },
};
