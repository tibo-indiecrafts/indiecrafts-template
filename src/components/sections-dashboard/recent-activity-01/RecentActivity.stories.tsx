import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RecentActivitySection from "./RecentActivity";
import { recentActivity01Sample } from "./config";

const meta: Meta<typeof RecentActivitySection> = {
  title: "Sections/Dashboard/RecentActivity01",
  component: RecentActivitySection,
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

type Story = StoryObj<typeof RecentActivitySection>;

export const Default: Story = {
  args: { ...recentActivity01Sample, id: "recent-activity-01-default" },
};

export const NoFooterLink: Story = {
  args: {
    ...recentActivity01Sample,
    id: "recent-activity-01-no-footer",
    viewAllHref: undefined,
  },
};

export const Empty: Story = {
  args: {
    id: "recent-activity-01-empty",
    items: [],
  },
};
