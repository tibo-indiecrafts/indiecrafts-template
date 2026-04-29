import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GlowingEffect } from "./glowing-effect";

const meta: Meta<typeof GlowingEffect> = {
  title: "UI Effects/GlowingEffect",
  component: GlowingEffect,
  parameters: { layout: "centered" },
  argTypes: {
    proximity: { control: { type: "range", min: 0, max: 300, step: 10 } },
    spread: { control: { type: "range", min: 0, max: 120, step: 5 } },
    blur: { control: { type: "range", min: 0, max: 30, step: 1 } },
    inactiveZone: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    movementDuration: { control: { type: "range", min: 0, max: 5, step: 0.25 } },
    borderWidth: { control: { type: "range", min: 1, max: 6, step: 1 } },
    variant: { control: "inline-radio", options: ["default", "white"] },
    glow: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof GlowingEffect>;

/**
 * The component paints its rainbow ring on the *border edge* of its parent,
 * extending `borderWidth` pixels beyond it. So the parent must:
 *  1. be `position: relative` with a visible `border`
 *  2. NOT use `overflow: hidden` (it clips the glow ring)
 *
 * The Aceternity demo pattern is an outer wrapper (border + padding) holding
 * `<GlowingEffect />` plus a separate inner content div.
 */
const GlowCard = ({
  children,
  className,
  effectProps,
}: {
  children: React.ReactNode;
  className?: string;
  effectProps: Parameters<typeof GlowingEffect>[0];
}) => (
  <div
    className={`relative rounded-2xl border border-border p-2 ${className ?? ""}`}
  >
    <GlowingEffect {...effectProps} />
    <div className="bg-card text-foreground rounded-xl p-6">{children}</div>
  </div>
);

/**
 * Default — move the cursor anywhere in or near the card. The rainbow ring
 * tracks the pointer around the outer border. Pass `glow` to keep the
 * placeholder ring visible at rest.
 */
export const Default: Story = {
  args: {
    disabled: false,
    glow: true,
    proximity: 200,
    spread: 50,
    blur: 0,
    inactiveZone: 0.05,
    movementDuration: 1.5,
    borderWidth: 2,
    variant: "default",
  },
  render: (args) => (
    <GlowCard className="h-60 w-80" effectProps={args}>
      <h3 className="text-xl font-semibold">Hover anywhere</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        Move the cursor over (or near) the card to track the rainbow gradient
        around the border.
      </p>
    </GlowCard>
  ),
};

/** White variant — monochrome ring using `variant="white"`. */
export const White: Story = {
  args: {
    disabled: false,
    glow: true,
    proximity: 200,
    spread: 50,
    inactiveZone: 0.05,
    borderWidth: 2,
    variant: "white",
  },
  render: (args) => (
    <div className="relative rounded-2xl border border-neutral-800 p-2">
      <GlowingEffect {...args} />
      <div className="rounded-xl bg-neutral-950 p-6 text-neutral-50">
        <h3 className="text-xl font-semibold">Monochrome glow</h3>
        <p className="mt-2 text-sm text-neutral-400">
          High-contrast on a near-black surface.
        </p>
      </div>
    </div>
  ),
};

/** Blurred — `blur={12}` softens the ring into a halo. */
export const Blurred: Story = {
  args: {
    disabled: false,
    glow: true,
    proximity: 240,
    spread: 80,
    blur: 12,
    inactiveZone: 0.05,
    movementDuration: 2,
    borderWidth: 3,
  },
  render: (args) => (
    <GlowCard className="h-60 w-80" effectProps={args}>
      <h3 className="text-xl font-semibold">Halo</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        Use <code>blur</code> to convert the sharp ring into a soft glow.
      </p>
    </GlowCard>
  ),
};

/** Thick ring — `borderWidth={4}` gives a chunky neon outline. */
export const ThickRing: Story = {
  args: {
    disabled: false,
    glow: true,
    proximity: 200,
    spread: 60,
    inactiveZone: 0.05,
    borderWidth: 4,
  },
  render: (args) => (
    <GlowCard className="h-60 w-80" effectProps={args}>
      <h3 className="text-xl font-semibold">Chunky outline</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        Bumping <code>borderWidth</code> from the 1px default to 4px makes the
        rainbow ring substantially more visible.
      </p>
    </GlowCard>
  ),
};

/** Disabled — only the static border placeholder renders, no pointer tracking. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <GlowCard className="h-60 w-80" effectProps={args}>
      <h3 className="text-xl font-semibold">Static border</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        With <code>disabled</code> set, only the static border placeholder
        renders — no pointer tracking, no rainbow gradient.
      </p>
    </GlowCard>
  ),
};

/** Grid — three cards exercise independent pointer tracking. */
export const Grid: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid grid-cols-1 gap-6 p-10 md:grid-cols-3">
      {[
        { title: "Fast", body: "Sub-second feedback loops, every time." },
        { title: "Modern", body: "React 19, Tailwind 4, Next 16." },
        { title: "Accessible", body: "WCAG AA out of the box." },
      ].map((p) => (
        <GlowCard
          key={p.title}
          className="h-44"
          effectProps={{
            disabled: false,
            glow: true,
            proximity: 200,
            spread: 50,
            inactiveZone: 0.05,
            borderWidth: 2,
          }}
        >
          <h3 className="text-xl font-semibold">{p.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm">{p.body}</p>
        </GlowCard>
      ))}
    </div>
  ),
};
