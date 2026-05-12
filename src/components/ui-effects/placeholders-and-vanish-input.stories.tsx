import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";

const meta: Meta<typeof PlaceholdersAndVanishInput> = {
  title: "UI Effects/Inputs/PlaceholdersAndVanishInput",
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
            Last submitted: <code className="text-foreground">{last ?? "<none>"}</code>
          </p>
        </div>
      </Stage>
    );
  },
};
