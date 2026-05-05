import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FullBleedLayout } from "./index";

const meta: Meta<typeof FullBleedLayout> = {
  title: "Layouts/FullBleed",
  component: FullBleedLayout,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FullBleedLayout>;

/** Gradient hero — children fill the viewport edge-to-edge. */
export const Default: Story = {
  render: () => (
    <FullBleedLayout>
      <div className="from-muted/60 via-muted/30 to-background min-h-screen bg-gradient-to-b">
        <section className="flex min-h-[60vh] items-center justify-center px-(--gutter)">
          <div className="text-center">
            <h2 className="text-5xl font-semibold tracking-tight">Edge-to-edge hero</h2>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Children render with no template gutter. Build immersive landing pages that
              bleed to the viewport edges.
            </p>
          </div>
        </section>
      </div>
    </FullBleedLayout>
  ),
};

/** Stacked sections — each child manages its own background and padding. */
export const StackedSections: Story = {
  render: () => (
    <FullBleedLayout>
      <section className="bg-muted/40 px-6 py-24 text-center">
        <h2 className="text-4xl font-semibold">Section one</h2>
        <p className="text-muted-foreground mt-2">Tinted full-width band.</p>
      </section>
      <section className="bg-foreground text-background px-6 py-24 text-center">
        <h2 className="text-4xl font-semibold">Section two</h2>
        <p className="mt-2 opacity-80">Inverted contrast band.</p>
      </section>
      <section className="px-6 py-24 text-center">
        <h2 className="text-4xl font-semibold">Section three</h2>
        <p className="text-muted-foreground mt-2">Plain background band.</p>
      </section>
    </FullBleedLayout>
  ),
};
