import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextReveal } from "./text-reveal";

const meta: Meta<typeof TextReveal> = {
  title: "UI Effects/TextReveal",
  component: TextReveal,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TextReveal>;

// The component uses hardcoded `text-black/20 dark:text-white/20` for ghost
// text and `text-black dark:text-white` for revealed text. Locking the
// surface to white (light) / slate-950 (dark) gives `text-black` a true
// 21:1 contrast ratio while `text-black/20` reads as a clear soft grey.
const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full bg-white dark:bg-slate-950">{children}</div>
);

/**
 * Default — sticky-section editorial reveal. The component renders a
 * `200vh` tall section; the inner text sticks to the top and each word
 * fades in as the user scrolls past it.
 */
export const Default: Story = {
  render: () => (
    <Page>
      <TextReveal>
        Scroll to reveal this text word by word — a classic editorial reveal
        powered by scroll progress.
      </TextReveal>
    </Page>
  ),
};

/** Long copy — exercises a paragraph-length reveal. */
export const LongCopy: Story = {
  render: () => (
    <Page>
      <TextReveal>
        Indiecrafts is a config-first Next.js template built for indie hackers
        who ship one client site per week. Every brand string, locale, and
        section blueprint lives in src/config — fork once, customise via data,
        skip the boilerplate.
      </TextReveal>
    </Page>
  ),
};

/** Manifesto — short punchy phrases stacked together. */
export const Manifesto: Story = {
  render: () => (
    <Page>
      <TextReveal>
        Build small. Ship often. Care about the details.
      </TextReveal>
    </Page>
  ),
};

/**
 * Brand colored — `[&_span]:text-primary` on the outer overrides the
 * component&apos;s hardcoded `text-black`/`text-white` so every word
 * resolves to the brand colour at its scroll-driven opacity.
 */
export const BrandColored: Story = {
  render: () => (
    <Page>
      <TextReveal className="[&_span]:text-primary">
        Bold brand-tinted reveal that stands out from the page as you scroll.
      </TextReveal>
    </Page>
  ),
};

/**
 * On dark — slate-950 surface. The hardcoded `dark:text-white/20` reads as
 * a soft grey ghost; `dark:text-white` is high-contrast on the deep slate.
 */
export const OnDark: Story = {
  render: () => (
    <div className="dark w-full bg-slate-950">
      <TextReveal>
        Inverted theme — dark variants resolve to white text on a deep slate
        background.
      </TextReveal>
    </div>
  ),
};
