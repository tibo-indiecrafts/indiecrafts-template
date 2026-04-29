import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";

const meta: Meta<typeof PlaceholdersAndVanishInput> = {
  title: "UI Effects/PlaceholdersAndVanishInput",
  component: PlaceholdersAndVanishInput,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PlaceholdersAndVanishInput>;

const PLACEHOLDERS = [
  "Search the docs",
  "Try a query",
  "What are you building today?",
  "Type and press Enter",
];

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[260px] w-full items-center justify-center p-10">
    <div className="w-[28rem] max-w-full">{children}</div>
  </div>
);

/**
 * Default — the placeholder cycles every 3s with a layout slide. On submit,
 * the typed text is vaporized character-by-character via a canvas effect.
 * Pass `onChange` and `onSubmit` to wire to your search handler.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <PlaceholdersAndVanishInput
        placeholders={PLACEHOLDERS}
        onChange={() => {}}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      />
    </Stage>
  ),
};

/** Single placeholder — `placeholders={[...]}` of length 1 stops the cycle. */
export const SinglePlaceholder: Story = {
  render: () => (
    <Stage>
      <PlaceholdersAndVanishInput
        placeholders={["Search the entire archive..."]}
        onChange={() => {}}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      />
    </Stage>
  ),
};

/** Long phrases — proves the cycling layout handles full sentences. */
export const LongPhrases: Story = {
  render: () => (
    <Stage>
      <PlaceholdersAndVanishInput
        placeholders={[
          "What kind of website are you trying to build today?",
          "Tell us about the client and the brand goals.",
          "Describe a design you saw recently that you loved.",
        ]}
        onChange={() => {}}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      />
    </Stage>
  ),
};

/** Controlled — capture changes + submissions via the callback props. */
export const Controlled: Story = {
  render: () => {
    const [last, setLast] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    return (
      <Stage>
        <div className="flex flex-col gap-4">
          <PlaceholdersAndVanishInput
            placeholders={PLACEHOLDERS}
            onChange={(e) => setDraft(e.target.value)}
            onSubmit={(e) => {
              e.preventDefault();
              setLast(draft);
            }}
          />
          <p className="text-muted-foreground text-sm">
            Last submitted:{" "}
            <code className="text-foreground">{last ?? "<none>"}</code>
          </p>
        </div>
      </Stage>
    );
  },
};
