import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoaderFive, LoaderFour, LoaderOne, LoaderThree, LoaderTwo } from "./loader";

const meta: Meta = {
  title: "UI Effects/Loaders & Progress/Loader",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/** Loader One — three pulsing dots that bounce vertically in sequence. */
export const One: Story = {
  render: () => (
    <Stage>
      <LoaderOne />
    </Stage>
  ),
};

/** Loader Two — three dots that slide horizontally with a stagger. */
export const Two: Story = {
  render: () => (
    <Stage>
      <LoaderTwo />
    </Stage>
  ),
};

/**
 * Loader Three — drawn lightning bolt SVG that fills with yellow as the
 * stroke completes, then reverses. Inherits theme colors via CSS vars.
 */
export const Three: Story = {
  render: () => (
    <Stage>
      <LoaderThree />
    </Stage>
  ),
};

/** Loader Four — chromatic glitched text. Pass `text` to customise. */
export const Four: Story = {
  render: () => (
    <Stage>
      <LoaderFour text="Loading…" />
    </Stage>
  ),
};

/** Loader Four (custom text). */
export const FourCustom: Story = {
  render: () => (
    <Stage>
      <LoaderFour text="Building site" />
    </Stage>
  ),
};

/** Loader Five — letters pulse + glow with a staggered delay. */
export const Five: Story = {
  render: () => (
    <Stage>
      <LoaderFive text="Indiecrafts" />
    </Stage>
  ),
};

/** All five — quick visual reference grid. */
export const AllVariants: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid w-full grid-cols-1 gap-6 p-10 md:grid-cols-2 lg:grid-cols-3">
      {[
        { label: "One", el: <LoaderOne /> },
        { label: "Two", el: <LoaderTwo /> },
        { label: "Three", el: <LoaderThree /> },
        { label: "Four", el: <LoaderFour text="Loading…" /> },
        { label: "Five", el: <LoaderFive text="Indiecrafts" /> },
      ].map((row) => (
        <div
          key={row.label}
          className="border-border bg-card flex flex-col items-center justify-center gap-3 rounded-lg border p-8"
        >
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {row.label}
          </span>
          {row.el}
        </div>
      ))}
    </div>
  ),
};
