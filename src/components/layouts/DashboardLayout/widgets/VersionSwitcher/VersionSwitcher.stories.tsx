import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SidebarProvider, Sidebar, SidebarHeader } from "@/components/ui-primitives/sidebar";
import { VersionSwitcher } from "./index";

const meta: Meta<typeof VersionSwitcher> = {
  title: "Layouts/Dashboard/Widgets/VersionSwitcher",
  component: VersionSwitcher,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarHeader>
            <Story />
          </SidebarHeader>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof VersionSwitcher>;

const versions = ["1.0.0", "1.1.0-alpha", "2.0.0-beta"] as const;

/** First entry selected — checkmark sits on the top dropdown row. */
export const Default: Story = {
  args: { versions: [...versions], defaultVersion: "1.0.0" },
};

/**
 * Mid-list version selected — verifies that the checkmark follows the
 * selection rather than always sticking to the top.
 */
export const MidVersionSelected: Story = {
  args: { versions: [...versions], defaultVersion: "1.1.0-alpha" },
};

/** Pre-release selected — exercises the trigger label with a non-numeric tag. */
export const PreReleaseSelected: Story = {
  args: { versions: [...versions], defaultVersion: "2.0.0-beta" },
};
