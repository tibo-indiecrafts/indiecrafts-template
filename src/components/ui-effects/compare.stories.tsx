import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Compare } from "./compare";

const meta: Meta<typeof Compare> = {
  title: "UI Effects/Particles & Effects/Compare",
  component: Compare,
  parameters: { layout: "centered" },
  argTypes: {
    slideMode: { control: "select", options: ["hover", "drag"] },
    initialSliderPercentage: { control: { type: "range", min: 0, max: 100 } },
    autoplay: { control: "boolean" },
    autoplayDuration: { control: { type: "number", min: 1000 } },
    showHandlebar: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Compare>;

const before = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=900&q=80";
const after = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card rounded-2xl border p-2">{children}</div>
);

/** Default — hover-driven slider, starting at 50%. */
export const Default: Story = {
  render: () => (
    <Frame>
      <Compare
        firstImage={before}
        secondImage={after}
        className="h-[300px] w-[420px]"
        firstImageClassName="object-cover"
        secondImageClassname="object-cover"
      />
    </Frame>
  ),
};

/** Drag mode — user drags the handle instead of hovering. */
export const DragMode: Story = {
  render: () => (
    <Frame>
      <Compare
        firstImage={before}
        secondImage={after}
        className="h-[300px] w-[420px]"
        firstImageClassName="object-cover"
        secondImageClassname="object-cover"
        slideMode="drag"
      />
    </Frame>
  ),
};

/** Autoplay — slider sweeps automatically; useful for hero showcases. */
export const Autoplay: Story = {
  render: () => (
    <Frame>
      <Compare
        firstImage={before}
        secondImage={after}
        className="h-[300px] w-[420px]"
        firstImageClassName="object-cover"
        secondImageClassname="object-cover"
        autoplay
        autoplayDuration={4000}
      />
    </Frame>
  ),
};

/**
 * Off-centre start — `initialSliderPercentage={20}` lands the handle near
 * the left so the "after" image dominates initially.
 */
export const OffCentreStart: Story = {
  render: () => (
    <Frame>
      <Compare
        firstImage={before}
        secondImage={after}
        className="h-[300px] w-[420px]"
        firstImageClassName="object-cover"
        secondImageClassname="object-cover"
        initialSliderPercentage={20}
      />
    </Frame>
  ),
};

/** No handlebar — minimalist sliding without the drag affordance. */
export const NoHandlebar: Story = {
  render: () => (
    <Frame>
      <Compare
        firstImage={before}
        secondImage={after}
        className="h-[300px] w-[420px]"
        firstImageClassName="object-cover"
        secondImageClassname="object-cover"
        showHandlebar={false}
      />
    </Frame>
  ),
};
