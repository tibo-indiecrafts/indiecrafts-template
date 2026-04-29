import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonsCard } from "./tailwindcss-buttons";

const meta: Meta<typeof ButtonsCard> = {
  title: "UI Effects/TailwindcssButtons",
  component: ButtonsCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ButtonsCard>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[420px] w-full items-center justify-center p-10">
    <div className="w-[420px]">{children}</div>
  </div>
);

/**
 * Default — frame for showcasing arbitrary button code samples. The card
 * renders a dotted-grid backdrop and reveals a clipboard icon on hover.
 * Drop any button into the slot.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <button className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-medium">
          Solid pill
        </button>
      </ButtonsCard>
    </Stage>
  ),
};

/** Outline — wraps an outlined button. */
export const OutlineButton: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <button className="border-foreground/30 text-foreground hover:bg-foreground/5 rounded-full border px-6 py-2 text-sm font-medium transition-colors">
          Ghost pill
        </button>
      </ButtonsCard>
    </Stage>
  ),
};

/** Gradient — showcases a richer CTA. */
export const Gradient: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-lg">
          Try the demo
        </button>
      </ButtonsCard>
    </Stage>
  ),
};

/** Multiple — one card with several CTAs to compare. */
export const Multiple: Story = {
  render: () => (
    <Stage>
      <ButtonsCard>
        <div className="flex flex-col items-center gap-3">
          <button className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-medium">
            Primary
          </button>
          <button className="border-foreground/30 text-foreground rounded-full border px-6 py-2 text-sm font-medium">
            Secondary
          </button>
        </div>
      </ButtonsCard>
    </Stage>
  ),
};

/** With onClick — cards forward `onClick` to mimic a copy-to-clipboard demo. */
export const WithClickHandler: Story = {
  render: () => (
    <Stage>
      <ButtonsCard
        onClick={() => {
          // copy-to-clipboard hook would go here
          // navigator.clipboard.writeText("...")
        }}
      >
        <button className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium">
          Click the card to log
        </button>
      </ButtonsCard>
    </Stage>
  ),
};
