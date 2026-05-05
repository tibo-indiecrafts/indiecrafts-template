import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconAd2, IconNews, IconSettingsCode } from "@tabler/icons-react";
import { Package } from "lucide-react";
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import { NavCollapse } from "./NavCollapse";

const meta: Meta<typeof NavCollapse> = {
  title: "UI Molecules/Sidebar/NavCollapse",
  component: NavCollapse,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar>
          <Story />
        </Sidebar>
      </SidebarProvider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NavCollapse>;

export const Default: Story = {
  args: {
    favorites: [
      { id: "design", color: "bg-green-400 dark:bg-green-300" },
      { id: "development", color: "bg-blue-400 dark:bg-blue-300" },
      { id: "workshop", color: "bg-orange-400 dark:bg-orange-300" },
      { id: "personal", color: "bg-red-400 dark:bg-red-300" },
    ],
    teams: [
      { id: "engineering", icon: IconSettingsCode },
      { id: "marketing", icon: IconAd2 },
    ],
    topics: [
      { id: "product-updates", icon: Package },
      { id: "company-news", icon: IconNews },
    ],
  },
};

/** Only `favorites` populated — teams + topics groups are not rendered. */
export const FavoritesOnly: Story = {
  args: {
    favorites: [
      { id: "design", color: "bg-green-400 dark:bg-green-300" },
      { id: "development", color: "bg-blue-400 dark:bg-blue-300" },
    ],
    teams: [],
    topics: [],
  },
};

/** Only `teams` populated — favorites + topics groups are not rendered. */
export const TeamsOnly: Story = {
  args: {
    favorites: [],
    teams: [
      { id: "engineering", icon: IconSettingsCode },
      { id: "marketing", icon: IconAd2 },
    ],
    topics: [],
  },
};

/** Only `topics` populated — favorites + teams groups are not rendered. */
export const TopicsOnly: Story = {
  args: {
    favorites: [],
    teams: [],
    topics: [
      { id: "product-updates", icon: Package },
      { id: "company-news", icon: IconNews },
    ],
  },
};
