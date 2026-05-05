import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./text-reveal-card";

const meta: Meta<typeof TextRevealCard> = {
  title: "UI Effects/Text/TextRevealCard",
  component: TextRevealCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TextRevealCard>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[420px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — drag the cursor across the card to reveal the secondary text.
 * The component layers `text` on top and `revealText` underneath; pointer X
 * controls a CSS clip that exposes the bottom layer.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <TextRevealCard text="You know the rules." revealText="And so do I." />
    </Stage>
  ),
};

/** With title + description — composed using the exported subcomponents. */
export const WithCopy: Story = {
  render: () => (
    <Stage>
      <TextRevealCard text="Indie. Hand-crafted." revealText="Production-ready. Today.">
        <TextRevealCardTitle>Indiecrafts</TextRevealCardTitle>
        <TextRevealCardDescription>
          A config-first Next.js template that turns weekend ideas into shippable client
          sites.
        </TextRevealCardDescription>
      </TextRevealCard>
    </Stage>
  ),
};

/** Marketing slogan — punchier copy for a CTA section. */
export const Marketing: Story = {
  render: () => (
    <Stage>
      <TextRevealCard text="Ship in a weekend." revealText="Not a quarter.">
        <TextRevealCardTitle>Built for speed</TextRevealCardTitle>
        <TextRevealCardDescription>
          Hover left or right to compare the timelines.
        </TextRevealCardDescription>
      </TextRevealCard>
    </Stage>
  ),
};

/** Custom className — pass `className` to override card sizing/colour. */
export const Wider: Story = {
  render: () => (
    <Stage>
      <TextRevealCard
        text="Two halves of the same coin."
        revealText="One forged in TypeScript."
        className="w-[640px] max-w-full"
      >
        <TextRevealCardTitle>Wide variant</TextRevealCardTitle>
        <TextRevealCardDescription>Custom width via className.</TextRevealCardDescription>
      </TextRevealCard>
    </Stage>
  ),
};
