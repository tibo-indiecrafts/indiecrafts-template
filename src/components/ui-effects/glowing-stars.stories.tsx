import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "./glowing-stars";

const meta: Meta<typeof GlowingStarsBackgroundCard> = {
  title: "UI Effects/Cards/GlowingStars",
  component: GlowingStarsBackgroundCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof GlowingStarsBackgroundCard>;

/**
 * Default — random stars twinkle on a 3-second interval; hover the card to
 * make every star light up at once. Composed from the three exported
 * primitives: `GlowingStarsBackgroundCard`, `GlowingStarsTitle`, and
 * `GlowingStarsDescription`.
 */
export const Default: Story = {
  render: () => (
    <GlowingStarsBackgroundCard>
      <GlowingStarsTitle>Cosmic Forge</GlowingStarsTitle>
      <GlowingStarsDescription>
        Hover this card to make every star ignite at once.
      </GlowingStarsDescription>
    </GlowingStarsBackgroundCard>
  ),
};

/** Title only — drop the description for a tighter card. */
export const TitleOnly: Story = {
  render: () => (
    <GlowingStarsBackgroundCard>
      <GlowingStarsTitle>Stargazing</GlowingStarsTitle>
    </GlowingStarsBackgroundCard>
  ),
};

/** Custom width — pass `className="max-w-sm"` to widen or narrow the card. */
export const CustomWidth: Story = {
  render: () => (
    <GlowingStarsBackgroundCard className="max-w-sm">
      <GlowingStarsTitle>Telescope</GlowingStarsTitle>
      <GlowingStarsDescription className="max-w-full">
        A wider card holds longer descriptions without wrapping awkwardly. Use the
        `className` prop to override the default `max-w-md`.
      </GlowingStarsDescription>
    </GlowingStarsBackgroundCard>
  ),
};

/**
 * Grid — three side-by-side cards. Each manages its own hover state so only
 * the hovered card lights up.
 */
export const Grid: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid w-full grid-cols-1 gap-6 p-10 md:grid-cols-3">
      {[
        { title: "Galaxy", body: "Spiraling arms of light." },
        { title: "Nebula", body: "Stellar nurseries of dust and gas." },
        { title: "Quasar", body: "Brightest objects in the visible universe." },
      ].map((p) => (
        <GlowingStarsBackgroundCard key={p.title}>
          <GlowingStarsTitle>{p.title}</GlowingStarsTitle>
          <GlowingStarsDescription>{p.body}</GlowingStarsDescription>
        </GlowingStarsBackgroundCard>
      ))}
    </div>
  ),
};
