import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sparkles } from "lucide-react";
import { GlareCard } from "./glare-card";

const meta: Meta<typeof GlareCard> = {
  title: "UI Effects/GlareCard",
  component: GlareCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof GlareCard>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[600px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — hover the card to see the holographic foil tilt with the pointer.
 * The base card is `bg-slate-950`; pass children for the front face.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <GlareCard className="flex flex-col items-center justify-center p-8 text-white">
        <Sparkles className="mb-4 h-10 w-10 text-amber-300" aria-hidden />
        <p className="text-2xl font-semibold">Indiecrafts</p>
        <p className="mt-1 text-sm text-white/60">Move your cursor</p>
      </GlareCard>
    </Stage>
  ),
};

/** Image fill — render an `<img>` as the front face for trading-card vibes. */
export const ImageFill: Story = {
  render: () => (
    <Stage>
      <GlareCard className="overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
          alt="Holographic landscape"
          className="h-full w-full object-cover"
        />
      </GlareCard>
    </Stage>
  ),
};

/** Brand surface — replace the slate baseline with a solid brand colour. */
export const BrandSurface: Story = {
  render: () => (
    <Stage>
      <GlareCard className="bg-primary text-primary-foreground flex flex-col items-center justify-center p-8">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase opacity-80">
          Studio pass
        </p>
        <p className="mt-3 text-3xl font-bold">2026</p>
        <p className="mt-2 text-sm opacity-70">Lifetime access</p>
      </GlareCard>
    </Stage>
  ),
};

/** Side by side — proves each card maintains its own pointer state. */
export const SideBySide: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background flex min-h-svh w-full flex-wrap items-center justify-center gap-10 p-10">
      <GlareCard className="flex flex-col items-center justify-center p-8 text-white">
        <p className="text-2xl font-semibold">Plan A</p>
        <p className="mt-1 text-sm text-white/60">Solo</p>
      </GlareCard>
      <GlareCard className="bg-primary text-primary-foreground flex flex-col items-center justify-center p-8">
        <p className="text-2xl font-semibold">Plan B</p>
        <p className="mt-1 text-sm opacity-70">Studio</p>
      </GlareCard>
    </div>
  ),
};
