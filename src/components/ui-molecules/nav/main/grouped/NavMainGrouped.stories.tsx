import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Activity,
  DollarSign,
  Home,
  Infinity,
  LinkIcon,
  Package2,
  Percent,
  PieChart,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { Sidebar, SidebarProvider } from "@/components/ui-primitives/sidebar";
import NavMainGrouped, { type Route } from "./NavMainGrouped";

const dashboardRoutes: Route[] = [
  { id: "home", icon: <Home className="size-4" />, link: "#" },
  {
    id: "products",
    icon: <Package2 className="size-4" />,
    link: "#",
    subs: [
      { id: "catalogue", link: "#", icon: <Package2 className="size-4" /> },
      { id: "checkout-links", link: "#", icon: <LinkIcon className="size-4" /> },
      { id: "discounts", link: "#", icon: <Percent className="size-4" /> },
    ],
  },
  {
    id: "usage-billing",
    icon: <PieChart className="size-4" />,
    link: "#",
    subs: [
      { id: "meters", link: "#", icon: <PieChart className="size-4" /> },
      { id: "events", link: "#", icon: <Activity className="size-4" /> },
    ],
  },
  { id: "benefits", icon: <Sparkles className="size-4" />, link: "#" },
  { id: "customers", icon: <Users className="size-4" />, link: "#" },
  {
    id: "sales",
    icon: <ShoppingBag className="size-4" />,
    link: "#",
    subs: [
      { id: "orders", link: "#", icon: <ShoppingBag className="size-4" /> },
      { id: "subscriptions", link: "#", icon: <Infinity className="size-4" /> },
    ],
  },
  { id: "storefront", icon: <Store className="size-4" />, link: "#" },
  { id: "analytics", icon: <TrendingUp className="size-4" />, link: "#" },
  {
    id: "finance",
    icon: <DollarSign className="size-4" />,
    link: "#",
    subs: [
      { id: "incoming", link: "#" },
      { id: "outgoing", link: "#" },
      { id: "payout-account", link: "#" },
    ],
  },
  {
    id: "settings",
    icon: <Settings className="size-4" />,
    link: "#",
    subs: [
      { id: "general", link: "#" },
      { id: "webhooks", link: "#" },
      { id: "custom-fields", link: "#" },
    ],
  },
];

const meta: Meta<typeof NavMainGrouped> = {
  title: "UI Molecules/Nav/Main/Grouped",
  component: NavMainGrouped,
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
type Story = StoryObj<typeof NavMainGrouped>;

export const Default: Story = {
  args: { namespace: "blocks.sidebar-02", routes: dashboardRoutes },
};
