import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EncryptedText } from "./encrypted-text";

const meta: Meta<typeof EncryptedText> = {
  title: "UI Effects/Text/EncryptedText",
  component: EncryptedText,
  parameters: { layout: "centered" },
  argTypes: {
    revealDelayMs: { control: { type: "range", min: 10, max: 500, step: 10 } },
    flipDelayMs: { control: { type: "range", min: 10, max: 300, step: 10 } },
  },
};
export default meta;

type Story = StoryObj<typeof EncryptedText>;

/** Default — characters scramble then resolve from left to right. */
export const Default: Story = {
  render: () => (
    <h1 className="text-4xl font-bold">
      <EncryptedText text="Indiecrafts Template" />
    </h1>
  ),
};

/** Fast — `revealDelayMs={20}` resolves the whole word in ~half a second. */
export const Fast: Story = {
  render: () => (
    <h1 className="text-4xl font-bold">
      <EncryptedText text="Decoded" revealDelayMs={20} flipDelayMs={20} />
    </h1>
  ),
};

/** Slow — drawn-out reveal for cinematic intros. */
export const Slow: Story = {
  render: () => (
    <h1 className="text-4xl font-bold">
      <EncryptedText text="Patience" revealDelayMs={150} flipDelayMs={80} />
    </h1>
  ),
};

/** Custom charset — only digits and symbols scramble during reveal. */
export const NumbersOnly: Story = {
  render: () => (
    <h1 className="font-mono text-3xl font-semibold">
      <EncryptedText text="404 not found" charset="0123456789" />
    </h1>
  ),
};

/**
 * Distinct styles — colour the encrypted (scrambled) and revealed states
 * differently, e.g. muted while scrambling and accent once resolved.
 */
export const StyledStates: Story = {
  render: () => (
    <h1 className="text-3xl font-bold">
      <EncryptedText
        text="Hello, world."
        encryptedClassName="text-muted-foreground"
        revealedClassName="text-emerald-500"
      />
    </h1>
  ),
};

/** Multi-word — long phrase reveals incrementally across the line. */
export const LongPhrase: Story = {
  render: () => (
    <p className="max-w-md text-center text-lg">
      <EncryptedText
        text="Build something extraordinary, one keystroke at a time."
        revealDelayMs={45}
      />
    </p>
  ),
};
