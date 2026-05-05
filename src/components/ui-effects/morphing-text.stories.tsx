import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MorphingText } from "./morphing-text";

const meta: Meta<typeof MorphingText> = {
  title: "UI Effects/Text/MorphingText",
  component: MorphingText,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MorphingText>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background text-foreground flex min-h-[280px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — four words morph into each other every 2s via an SVG threshold
 * filter that produces a metaball-style transition. Pass any number of
 * strings via the `texts` array.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <MorphingText texts={["Build", "Ship", "Iterate", "Repeat"]} />
    </Stage>
  ),
};

/** Single-word slogan — periods accentuate the cadence. */
export const Slogan: Story = {
  render: () => (
    <Stage>
      <MorphingText texts={["Beautiful.", "Modern.", "Accessible.", "Fast."]} />
    </Stage>
  ),
};

/** Two terms — minimum viable cycle (binary morphing). */
export const TwoTerms: Story = {
  render: () => (
    <Stage>
      <MorphingText texts={["Hello", "World"]} />
    </Stage>
  ),
};

/** Long phrases — the threshold filter still resolves cleanly with sentences. */
export const LongPhrases: Story = {
  render: () => (
    <Stage>
      <MorphingText
        texts={["Rapid prototypes", "Production sites", "Reusable templates"]}
      />
    </Stage>
  ),
};

/** Smaller — compress the morph into card-sized headlines via `className`. */
export const Smaller: Story = {
  render: () => (
    <Stage>
      <MorphingText
        texts={["Code", "Test", "Ship"]}
        className="h-12 text-[28pt] md:h-16 lg:text-[40pt]"
      />
    </Stage>
  ),
};
