import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DashboardLayout } from "./index";

const meta: Meta<typeof DashboardLayout> = {
  title: "Layouts/Dashboard",
  component: DashboardLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DashboardLayout>;

/** Three KPI cards inside the dashboard chrome (sidebar + header + main). */
export const Default: Story = {
  render: () => (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="bg-muted/40 grid grid-cols-1 gap-4 rounded-xl p-6 md:grid-cols-3">
          <div className="bg-background rounded-lg p-4">
            <p className="text-muted-foreground text-xs">Visitors</p>
            <p className="mt-2 text-3xl font-semibold">12,408</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-muted-foreground text-xs">Conversion</p>
            <p className="mt-2 text-3xl font-semibold">4.7%</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-muted-foreground text-xs">MRR</p>
            <p className="mt-2 text-3xl font-semibold">$84,210</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  ),
};

/**
 * Long-form page — proves the main column scrolls independently of the
 * sidebar and that the sticky header stays at the top.
 */
export const LongContent: Story = {
  render: () => (
    <DashboardLayout>
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-muted/30 rounded-xl p-6">
            <p className="text-muted-foreground text-xs">Card {i + 1}</p>
            <p className="mt-2 text-2xl font-semibold">
              {Math.round((i + 1) * 1247.5).toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Sample row used to demonstrate that the dashboard main area scrolls
              independently of the sticky header and sidebar.
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  ),
};

/**
 * Empty main — no children. Confirms the chrome (sidebar + header) renders
 * without breaking when the page has nothing to show yet.
 */
export const Empty: Story = {
  render: () => <DashboardLayout>{null}</DashboardLayout>,
};
