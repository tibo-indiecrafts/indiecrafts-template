import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StickyBanner } from "./sticky-banner";

const meta: Meta<typeof StickyBanner> = {
  title: "UI Effects/Modals & Overlays/StickyBanner",
  component: StickyBanner,
  parameters: { layout: "fullscreen" },
  argTypes: {
    hideOnScroll: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof StickyBanner>;

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background h-[200vh] w-full">
    {children}
    <div className="text-foreground mx-auto max-w-2xl px-6 py-32">
      <h1 className="text-4xl font-bold">Sticky banner demo</h1>
      <p className="text-muted-foreground mt-4 max-w-prose">
        The banner sticks to the top of the viewport. Click the close icon to dismiss it.
      </p>
    </div>
  </div>
);

/**
 * Default — informational banner with brand background. Click the close X
 * to dismiss; the banner slides up off-screen.
 */
export const Default: Story = {
  render: () => (
    <Page>
      <StickyBanner className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <p className="mx-auto max-w-7xl text-center text-sm text-white">
          🚀 New release — Indiecrafts v2 ships next Friday.{" "}
          <a href="#read" className="underline underline-offset-2">
            Read the changelog
          </a>
        </p>
      </StickyBanner>
    </Page>
  ),
};

/** Hide on scroll — `hideOnScroll` collapses the banner past 40px. */
export const HideOnScroll: Story = {
  render: () => (
    <Page>
      <StickyBanner
        hideOnScroll
        className="bg-gradient-to-r from-fuchsia-600 to-rose-500"
      >
        <p className="mx-auto max-w-7xl text-center text-sm text-white">
          🎉 Free shipping this weekend — banner hides as you scroll.
        </p>
      </StickyBanner>
    </Page>
  ),
};

/**
 * Brand colour — gradient stops use the brand token (`bg-primary` mirrors
 * `--brand` from theme.config.ts), so the banner inherits any rebrand.
 */
export const BrandColor: Story = {
  render: () => (
    <Page>
      <StickyBanner className="bg-primary">
        <p className="text-primary-foreground mx-auto max-w-7xl text-center text-sm">
          ✨ Sale ends Sunday — code{" "}
          <code className="bg-background/20 rounded px-1.5 py-0.5">CRAFT15</code>
        </p>
      </StickyBanner>
    </Page>
  ),
};

/** Dark — high-contrast banner with white-on-black. */
export const Dark: Story = {
  render: () => (
    <Page>
      <StickyBanner className="bg-neutral-950">
        <p className="mx-auto max-w-7xl text-center text-sm text-white/90">
          🔒 Maintenance window starts at 02:00 UTC.{" "}
          <a href="#status" className="underline underline-offset-2">
            Status page
          </a>
        </p>
      </StickyBanner>
    </Page>
  ),
};
