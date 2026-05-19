import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SiteDrawer } from "./index";

const meta: Meta<typeof SiteDrawer> = {
  title: "Layouts/Shared/SiteDrawer",
  component: SiteDrawer,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SiteDrawer>;

export const Default: Story = {
  render: () => (
    <div className="bg-background relative min-h-screen w-full">
      <SiteDrawer />
    </div>
  ),
};

export const FromRight: Story = {
  render: () => (
    <div className="bg-background relative min-h-screen w-full">
      <SiteDrawer direction="right" buttonOpeningVariants="push" />
    </div>
  ),
};

export const StayButton: Story = {
  render: () => (
    <div className="bg-background relative min-h-screen w-full">
      <SiteDrawer buttonOpeningVariants="stay" />
    </div>
  ),
};
