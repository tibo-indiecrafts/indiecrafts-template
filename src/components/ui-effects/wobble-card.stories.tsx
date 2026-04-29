import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WobbleCard } from "./wobble-card";

const meta: Meta<typeof WobbleCard> = {
  title: "UI Effects/WobbleCard",
  component: WobbleCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof WobbleCard>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[480px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — indigo card that wobbles toward the cursor by ±20px and the
 * inner content counter-translates for a subtle parallax. Use one of the
 * `containerClassName` brand swaps below to retune the surface.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <WobbleCard containerClassName="max-w-md">
        <h3 className="text-2xl font-bold text-white">Indiecrafts</h3>
        <p className="mt-3 text-sm text-white/80">
          Hover the card and move the cursor — the card subtly wobbles toward
          your pointer while the content drifts the other way.
        </p>
      </WobbleCard>
    </Stage>
  ),
};

/** Brand colour — `containerClassName` overrides the default indigo surface. */
export const Cyan: Story = {
  render: () => (
    <Stage>
      <WobbleCard containerClassName="max-w-md bg-cyan-700">
        <h3 className="text-2xl font-bold text-white">Cyan plan</h3>
        <p className="mt-3 text-sm text-white/80">
          Drop in a brand-coloured background via Tailwind utilities.
        </p>
      </WobbleCard>
    </Stage>
  ),
};

/** Wide — `max-w-2xl` for an editorial-width card. */
export const Wide: Story = {
  render: () => (
    <Stage>
      <WobbleCard containerClassName="max-w-2xl bg-rose-700">
        <h3 className="text-3xl font-bold text-white">Cover story</h3>
        <p className="mt-3 max-w-prose text-base text-white/85">
          A wider variant suits feature spotlights and editorial covers. The
          inner padding keeps headlines and body copy readable at any size.
        </p>
      </WobbleCard>
    </Stage>
  ),
};

/**
 * With image — wrap an image inside the card; it wobbles with the inner
 * content layer for a layered parallax feel.
 */
export const WithImage: Story = {
  render: () => (
    <Stage>
      <WobbleCard
        containerClassName="max-w-lg bg-emerald-700"
        className="px-0 py-0 sm:px-0"
      >
        <img
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80"
          alt=""
          className="h-64 w-full object-cover"
        />
        <div className="space-y-2 p-6">
          <h3 className="text-2xl font-bold text-white">Atelier Lisbon</h3>
          <p className="text-sm text-white/80">
            A 19th-century carriage house turned design studio.
          </p>
        </div>
      </WobbleCard>
    </Stage>
  ),
};

/** Grid — three independent wobble cards. */
export const Grid: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid grid-cols-1 gap-6 p-10 md:grid-cols-3">
      {[
        {
          color: "bg-indigo-800",
          title: "Plan A",
          body: "Solo creators.",
        },
        {
          color: "bg-rose-700",
          title: "Plan B",
          body: "Studios with up to ten projects.",
        },
        {
          color: "bg-emerald-700",
          title: "Plan C",
          body: "Agencies with multi-tenant routing.",
        },
      ].map((p) => (
        <WobbleCard key={p.title} containerClassName={p.color}>
          <h3 className="text-2xl font-bold text-white">{p.title}</h3>
          <p className="mt-3 text-sm text-white/80">{p.body}</p>
        </WobbleCard>
      ))}
    </div>
  ),
};
