import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { TeamSwitcherGrouped } from "./TeamSwitcherGrouped";

const meta: Meta<typeof TeamSwitcherGrouped> = {
  title: "UI Molecules/Sidebar/TeamSwitcher/Grouped",
  component: TeamSwitcherGrouped,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar>
          <div className="px-2 py-4">
            <Story />
          </div>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TeamSwitcherGrouped>;

export const Default: Story = {
  args: {
    namespace: "blocks.sidebar-02",
    teams: [
      { id: "alpha-inc", logo: LogoIcon, planKey: "free" },
      { id: "beta-corp", logo: LogoIcon, planKey: "free" },
      { id: "gamma-tech", logo: LogoIcon, planKey: "free" },
    ],
  },
};
