import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MacbookScroll } from "./macbook-scroll";

const meta: Meta<typeof MacbookScroll> = {
  title: "UI Effects/3D & Devices/MacbookScroll",
  component: MacbookScroll,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MacbookScroll>;

/**
 * Default — the iconic Apple-style hero. Scroll the canvas to see the
 * MacBook lid open and a screenshot fill the display. The animation is
 * driven by `useScroll` against the section&apos;s own offset.
 */
export const Default: Story = {
  render: () => (
    <MacbookScroll
      title={
        <span>
          This MacBook scrolls beautifully. <br /> No kidding.
        </span>
      }
      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80"
      showGradient
    />
  ),
};

/** With badge — a "New" pill above the headline (or any ReactNode). */
export const WithBadge: Story = {
  render: () => (
    <MacbookScroll
      title="Indiecrafts dashboard"
      badge={
        <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold">
          New
        </span>
      }
      src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80"
      showGradient
    />
  ),
};

/** No gradient — `showGradient={false}` removes the bottom fade overlay. */
export const NoGradient: Story = {
  render: () => (
    <MacbookScroll
      title="A cleaner view"
      src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1600&q=80"
    />
  ),
};

/** No screenshot — without `src` the screen renders empty (chrome only). */
export const NoScreenshot: Story = {
  render: () => <MacbookScroll title="Just the device" showGradient />,
};
