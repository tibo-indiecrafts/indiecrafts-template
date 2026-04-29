import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CometCard } from "./comet-card";

const meta: Meta<typeof CometCard> = {
  title: "UI Effects/CometCard",
  component: CometCard,
  parameters: { layout: "centered" },
  argTypes: {
    rotateDepth: { control: { type: "range", min: 0, max: 45, step: 0.5 } },
    translateDepth: { control: { type: "range", min: 0, max: 60, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof CometCard>;

const ProductCard = () => (
  <div className="flex w-[320px] flex-col gap-2 rounded-2xl bg-zinc-900 p-4 text-zinc-50">
    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl">
      <img
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
    <p className="mt-2 text-sm font-medium">Air Jordan 4 Retro</p>
    <p className="text-xs text-zinc-400">Reimagined Bred — November 2024</p>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-xs text-zinc-400">Limited drop</span>
      <span className="text-base font-bold">$499</span>
    </div>
  </div>
);

/** Default — moderate tilt + translate on hover. */
export const Default: Story = {
  render: () => (
    <CometCard>
      <ProductCard />
    </CometCard>
  ),
};

/** Subtle — reduced rotate + translate for understated motion. */
export const Subtle: Story = {
  render: () => (
    <CometCard rotateDepth={6} translateDepth={6}>
      <ProductCard />
    </CometCard>
  ),
};

/** Aggressive — full tilt for marquee / showcase contexts. */
export const Aggressive: Story = {
  render: () => (
    <CometCard rotateDepth={30} translateDepth={40}>
      <ProductCard />
    </CometCard>
  ),
};

/**
 * Text-only — comet shadow + glare even without media. Useful for
 * testimonial / quote cards.
 */
export const TextOnly: Story = {
  render: () => (
    <CometCard>
      <div className="w-[360px] rounded-2xl bg-zinc-900 p-6 text-zinc-50">
        <p className="text-lg leading-relaxed">
          &ldquo;The hover-tilt is so smooth my product manager asked if it was a
          video.&rdquo;
        </p>
        <p className="mt-4 text-xs text-zinc-400">— Jamie, frontend lead</p>
      </div>
    </CometCard>
  ),
};
