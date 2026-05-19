import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarChart2, Bell, Home, Search, Settings } from "lucide-react";

import { LiquidGlassCard } from "./index";

const meta: Meta<typeof LiquidGlassCard> = {
  title: "UI Effects/Cards/LiquidGlassCard",
  component: LiquidGlassCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LiquidGlassCard>;

const BACKGROUND =
  "url('https://images.unsplash.com/photo-1752440093057-1c188e7137e9?q=80&w=1200&auto=format&fit=crop') center / cover no-repeat";

export const SidebarMenu: Story = {
  render: () => (
    <div
      className="flex w-full items-center justify-center rounded-xl p-8 py-20"
      style={{ background: BACKGROUND }}
    >
      <LiquidGlassCard
        glowIntensity="sm"
        shadowIntensity="sm"
        borderRadius="12px"
        blurIntensity="sm"
        draggable
        className="w-[280px] p-4"
      >
        <nav className="relative z-30 w-full space-y-2">
          <button
            type="button"
            aria-current="page"
            className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-white transition-colors hover:bg-white/20"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span>Search</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-white transition-colors hover:bg-white/20"
          >
            <BarChart2 className="h-5 w-5" aria-hidden="true" />
            <span>Sales Analytics</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-white transition-colors hover:bg-white/20"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span>Notification</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-white transition-colors hover:bg-white/20"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
            <span>Account Settings</span>
          </button>
        </nav>
      </LiquidGlassCard>
    </div>
  ),
};
