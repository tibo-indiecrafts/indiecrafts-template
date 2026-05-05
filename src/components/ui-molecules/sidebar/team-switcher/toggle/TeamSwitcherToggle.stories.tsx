import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  IconBrandGoogle,
  IconBrandMeta,
  IconBrandOpenai,
  IconNorthStar,
} from "@tabler/icons-react";
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { TeamSwitcherToggle } from "./TeamSwitcherToggle";

const meta: Meta<typeof TeamSwitcherToggle> = {
  title: "UI Molecules/Sidebar/TeamSwitcher/Toggle",
  component: TeamSwitcherToggle,
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
type Story = StoryObj<typeof TeamSwitcherToggle>;

export const Default: Story = {
  args: {
    namespace: "blocks.sidebar-05",
    teams: [
      { id: "openai", logo: IconBrandOpenai },
      { id: "anthropic", logo: IconNorthStar },
      { id: "google", logo: IconBrandGoogle },
      { id: "meta", logo: IconBrandMeta },
    ],
  },
};
