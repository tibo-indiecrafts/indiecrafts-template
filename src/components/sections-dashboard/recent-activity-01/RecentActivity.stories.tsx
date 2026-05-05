import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RecentActivitySection from "./RecentActivity";
import { recentActivity01Sample } from "./config";

const meta: Meta<typeof RecentActivitySection> = {
  title: "Sections/Dashboard/RecentActivity01",
  component: RecentActivitySection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto flex w-full max-w-5xl justify-center pt-12">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof RecentActivitySection>;

/** Default — 5 demo events with the "View all" footer link. */
export const Default: Story = {
  args: { ...recentActivity01Sample, id: "recent-activity-01-default" },
};

/** Without footer link — drops the "View all" CTA when no `viewAllHref` is set. */
export const NoFooterLink: Story = {
  args: {
    ...recentActivity01Sample,
    id: "recent-activity-01-no-footer",
    viewAllHref: undefined,
  },
};

/** Empty state — renders the "No recent activity yet." callout. */
export const Empty: Story = {
  args: {
    id: "recent-activity-01-empty",
    items: [],
  },
};
