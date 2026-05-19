import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShimmerLoader } from "./index";

const meta: Meta<typeof ShimmerLoader> = {
  title: "UI Molecules/Widget/ShimmerLoader",
  component: ShimmerLoader,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ShimmerLoader>;

const ICONS = ["✦", "◆", "✶", "❋", "✸"];

export const WithPercent: Story = {
  render: () => (
    <div className="w-[420px] rounded-lg bg-zinc-950 p-4">
      <ShimmerLoader
        labels={["Scanning…", "Analysing…", "Detecting…", "Profiling…"]}
        icons={ICONS}
        duration={3000}
        showPercent
      />
    </div>
  ),
};

export const WithTokenCounter: Story = {
  render: () => (
    <div className="w-[420px] rounded-lg bg-zinc-950 p-4">
      <ShimmerLoader
        labels={["Booting…", "Loading…", "Preparing…"]}
        icons={ICONS}
        duration={3000}
        tokenTarget={0.6}
        showPercent
      />
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div className="w-[420px] rounded-lg bg-zinc-950 p-4">
      <ShimmerLoader
        labels={["Almost there…"]}
        icons={ICONS}
        duration={2500}
        showPercent={false}
      />
    </div>
  ),
};
