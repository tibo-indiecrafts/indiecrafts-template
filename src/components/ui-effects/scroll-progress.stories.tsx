import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollProgress } from "./scroll-progress";

const meta: Meta<typeof ScrollProgress> = {
  title: "UI Effects/Loaders & Progress/ScrollProgress",
  component: ScrollProgress,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrollProgress>;

const LongPage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background h-[300vh] w-full">{children}</div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="text-foreground mx-auto max-w-2xl px-6 py-32">
    <h1 className="text-4xl font-bold">{title}</h1>
    <p className="text-muted-foreground mt-4 max-w-prose">{body}</p>
  </div>
);

/**
 * Default — pink → orange gradient bar fixed to the top of the viewport that
 * grows as the user scrolls (scaleX from 0 → 1). Mounts at `top-0 z-50` so
 * it sits above page chrome.
 */
export const Default: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress />
      <Body
        title="Scroll progress"
        body="Scroll up and down — the gradient bar at the top of the viewport tracks your progress through the page."
      />
    </LongPage>
  ),
};

/**
 * Brand colour — `className` overrides the gradient with brand-token stops
 * (`from-primary`/`via-primary`/`to-brand-foreground`) so the bar follows the
 * template brand at any theme.
 */
export const BrandColor: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress className="from-primary via-primary to-brand-foreground" />
      <Body
        title="Brand-tinted bar"
        body="Tailwind brand tokens drive the gradient — rebrand by changing one CSS var."
      />
    </LongPage>
  ),
};

/** Thicker — bump height via className (`h-1`). */
export const Thicker: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress className="h-1" />
      <Body
        title="Thicker bar"
        body="Default is 1px high; bump it via className for more presence."
      />
    </LongPage>
  ),
};

/** Bottom — pin to bottom edge via `top-auto bottom-0`. */
export const Bottom: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress className="top-auto bottom-0" />
      <Body
        title="Bottom-pinned bar"
        body="Override the position with classes if you prefer the indicator at the bottom."
      />
    </LongPage>
  ),
};
