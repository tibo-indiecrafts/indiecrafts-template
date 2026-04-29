import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DirectionAwareHover } from "./direction-aware-hover";

const meta: Meta<typeof DirectionAwareHover> = {
  title: "UI Effects/DirectionAwareHover",
  component: DirectionAwareHover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Image card that detects which edge your cursor entered from (top/right/bottom/left) and slides the overlay caption in from that direction.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DirectionAwareHover>;

/** Default — image card with title + price overlay. */
export const Default: Story = {
  render: () => (
    <DirectionAwareHover imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80">
      <p className="text-base font-bold">Air Jordan 4 Retro</p>
      <p className="text-sm font-normal opacity-80">$199</p>
    </DirectionAwareHover>
  ),
};

/** Long caption — multiple lines flow inside the overlay. */
export const LongCaption: Story = {
  render: () => (
    <DirectionAwareHover imageUrl="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80">
      <p className="text-base font-bold">Iceland in winter</p>
      <p className="text-xs font-normal opacity-80">
        Black-sand beaches and waterfalls under the aurora — only six hours
        from London with the right airline.
      </p>
    </DirectionAwareHover>
  ),
};

/** Plain text child — caption can be a string instead of JSX. */
export const StringCaption: Story = {
  render: () => (
    <DirectionAwareHover imageUrl="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1000&q=80">
      Hover from any side
    </DirectionAwareHover>
  ),
};

/** Custom child styling — `childrenClassName` retunes the caption layer. */
export const CustomCaptionStyle: Story = {
  render: () => (
    <DirectionAwareHover
      imageUrl="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80"
      childrenClassName="bottom-6 left-6 right-6 rounded-md bg-black/50 px-3 py-2 backdrop-blur"
    >
      <p className="text-sm font-bold">Translucent caption pill</p>
    </DirectionAwareHover>
  ),
};
