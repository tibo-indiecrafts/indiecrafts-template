import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TypewriterEffect, TypewriterEffectSmooth } from "./typewriter-effect";

const meta: Meta<typeof TypewriterEffect> = {
  title: "UI Effects/Text/TypewriterEffect",
  component: TypewriterEffect,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TypewriterEffect>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[280px] w-full items-center justify-center p-10">
    {children}
  </div>
);

const WORDS = [
  { text: "Build" },
  { text: "something" },
  { text: "awesome", className: "text-primary" },
  { text: "today." },
];

/**
 * Default — character-by-character reveal with a blinking cursor. Each word
 * can carry its own `className` for inline highlights.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <TypewriterEffect words={WORDS} />
    </Stage>
  ),
};

/** Smooth — `TypewriterEffectSmooth` reveals letters with a width animation. */
export const Smooth: Story = {
  render: () => (
    <Stage>
      <TypewriterEffectSmooth words={WORDS} />
    </Stage>
  ),
};

/** Long phrase — proves the per-character cadence stays smooth on more text. */
export const LongPhrase: Story = {
  render: () => (
    <Stage>
      <TypewriterEffect
        words={[
          { text: "Indiecrafts" },
          { text: "is" },
          { text: "a" },
          { text: "config-first", className: "text-primary" },
          { text: "Next.js" },
          { text: "template." },
        ]}
      />
    </Stage>
  ),
};

/** Custom cursor — `cursorClassName` retunes the blinking caret. */
export const CustomCursor: Story = {
  render: () => (
    <Stage>
      <TypewriterEffect words={WORDS} cursorClassName="bg-fuchsia-500 w-1 h-9 md:h-12" />
    </Stage>
  ),
};

/** Hero scale — bigger type via `className`. */
export const Hero: Story = {
  render: () => (
    <Stage>
      <TypewriterEffect words={WORDS} className="text-5xl font-bold md:text-7xl" />
    </Stage>
  ),
};
