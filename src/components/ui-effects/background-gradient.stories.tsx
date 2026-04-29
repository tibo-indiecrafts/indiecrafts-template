import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackgroundGradient } from "./background-gradient";

const meta: Meta<typeof BackgroundGradient> = {
  title: "UI Effects/BackgroundGradient",
  component: BackgroundGradient,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BackgroundGradient>;

const HeroCard = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-card flex w-[320px] flex-col gap-2 rounded-3xl p-6">
    <img
      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
      alt=""
      className="h-44 w-full rounded-xl object-cover"
    />
    {children ?? (
      <>
        <h3 className="mt-2 text-lg font-semibold">Air Jordan 4 Retro</h3>
        <p className="text-muted-foreground text-sm">
          The Air Jordan 4 Retro Reimagined Bred will release in November 2024.
        </p>
        <button className="bg-foreground text-background mt-3 self-start rounded-full px-4 py-1.5 text-xs">
          Buy now $499
        </button>
      </>
    )}
  </div>
);

/** Default — animated radial gradient halo around a product card. */
export const Default: Story = {
  render: () => (
    <BackgroundGradient>
      <HeroCard />
    </BackgroundGradient>
  ),
};

/** Static — `animate={false}` freezes the gradient at its initial position. */
export const Static: Story = {
  render: () => (
    <BackgroundGradient animate={false}>
      <HeroCard />
    </BackgroundGradient>
  ),
};

/** Custom container size — `containerClassName` controls outer dimensions. */
export const Compact: Story = {
  render: () => (
    <BackgroundGradient containerClassName="rounded-2xl">
      <div className="bg-card flex w-[220px] items-center gap-3 rounded-2xl p-4">
        <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <div className="flex flex-col">
          <p className="text-sm font-semibold">Pro plan</p>
          <p className="text-muted-foreground text-xs">$19 / month</p>
        </div>
      </div>
    </BackgroundGradient>
  ),
};

/**
 * Wrapping plain text — useful as an attention-getting badge for a
 * limited-time announcement.
 */
export const TextBadge: Story = {
  render: () => (
    <BackgroundGradient containerClassName="rounded-full">
      <p className="bg-card rounded-full px-6 py-2 text-sm font-medium">
        🎉 Black Friday — 40% off all plans
      </p>
    </BackgroundGradient>
  ),
};
