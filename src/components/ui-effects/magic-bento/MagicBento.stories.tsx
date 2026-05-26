import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MagicBento, type MagicBentoItem } from "./index";

const meta: Meta<typeof MagicBento> = {
  title: "UI Effects/Animations/MagicBento",
  component: MagicBento,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MagicBento>;

const ITEMS: MagicBentoItem[] = [
  { label: "Insights", title: "Analytics", description: "Track user behavior" },
  { label: "Overview", title: "Dashboard", description: "Centralized data view" },
  { label: "Teamwork", title: "Collaboration", description: "Work together seamlessly" },
  { label: "Efficiency", title: "Automation", description: "Streamline workflows" },
  { label: "Connectivity", title: "Integration", description: "Connect favorite tools" },
  { label: "Protection", title: "Security", description: "Enterprise-grade protection" },
];

export const Showcase: Story = {
  render: () => (
    <div className="flex min-h-dvh w-dvw items-center justify-center bg-black p-8">
      <MagicBento
        items={ITEMS}
        textAutoHide
        enableStars
        enableSpotlight
        enableBorderGlow
        enableTilt={false}
        enableMagnetism={false}
        clickEffect
        spotlightRadius={400}
        particleCount={12}
        glowColor="132, 0, 255"
        disableAnimations={false}
      />
    </div>
  ),
};

export const WithTiltAndMagnet: Story = {
  render: () => (
    <div className="flex min-h-dvh w-dvw items-center justify-center bg-black p-8">
      <MagicBento
        items={ITEMS}
        textAutoHide
        enableStars
        enableSpotlight
        enableBorderGlow
        enableTilt
        enableMagnetism
        clickEffect
        spotlightRadius={500}
        particleCount={18}
        glowColor="0, 200, 255"
      />
    </div>
  ),
};
