import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MacbookScroll } from "./macbook-scroll";

const meta: Meta<typeof MacbookScroll> = {
  title: "UI Effects/3D & Devices/MacbookScroll",
  component: MacbookScroll,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MacbookScroll>;

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

export const NoGradient: Story = {
  render: () => (
    <MacbookScroll
      title="A cleaner view"
      src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1600&q=80"
    />
  ),
};

export const NoScreenshot: Story = {
  render: () => <MacbookScroll title="Just the device" showGradient />,
};
