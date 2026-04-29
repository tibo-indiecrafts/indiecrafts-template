import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardStack } from "./card-stack";

const meta: Meta<typeof CardStack> = {
  title: "UI Effects/CardStack",
  component: CardStack,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CardStack>;

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-semibold">
    {children}
  </span>
);

const CARDS = [
  {
    id: 0,
    name: "Sarah Chen",
    designation: "Product Engineer at Linear",
    content: (
      <p>
        We replaced four bespoke marketing sites with this template — only{" "}
        <Highlight>config files</Highlight> differ between them now.
      </p>
    ),
  },
  {
    id: 1,
    name: "Marcus Rivera",
    designation: "Lead Designer at Vercel",
    content: (
      <p>
        The <Highlight>theme tokens</Highlight> survive a brand refresh without a
        single component rewrite. That alone paid for the migration.
      </p>
    ),
  },
  {
    id: 2,
    name: "Aisha Patel",
    designation: "Frontend Architect at Stripe",
    content: (
      <p>
        Adding a third locale took an afternoon — translations live{" "}
        <Highlight>next to the page</Highlight>, not in a giant root file.
      </p>
    ),
  },
];

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-[420px] items-center justify-center">{children}</div>
);

/** Default — auto-cycles every 5 s; top card flips to the back. */
export const Default: Story = {
  render: () => (
    <Frame>
      <CardStack items={CARDS} />
    </Frame>
  ),
};

/** Wide offset — `offset={20}` exposes more of each underlying card. */
export const WideOffset: Story = {
  render: () => (
    <Frame>
      <CardStack items={CARDS} offset={20} />
    </Frame>
  ),
};

/** Tight offset — minimal overlap; cards almost stack on top of each other. */
export const TightOffset: Story = {
  render: () => (
    <Frame>
      <CardStack items={CARDS} offset={4} scaleFactor={0.02} />
    </Frame>
  ),
};

/** Aggressive scale — `scaleFactor={0.12}` makes back cards visibly smaller. */
export const AggressiveScale: Story = {
  render: () => (
    <Frame>
      <CardStack items={CARDS} scaleFactor={0.12} />
    </Frame>
  ),
};
