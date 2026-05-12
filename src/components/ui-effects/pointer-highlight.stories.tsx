import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PointerHighlight } from "./pointer-highlight";

const meta: Meta<typeof PointerHighlight> = {
  title: "UI Effects/Hover & Interactions/PointerHighlight",
  component: PointerHighlight,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PointerHighlight>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[260px] w-full items-center justify-center p-10">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <p className="text-foreground text-3xl font-semibold">
        Build sites that{" "}
        <PointerHighlight>
          <span className="px-1">ship fast</span>
        </PointerHighlight>
        .
      </p>
    </Stage>
  ),
};

export const BrandColors: Story = {
  render: () => (
    <Stage>
      <p className="text-foreground text-3xl font-semibold">
        Designed for{" "}
        <PointerHighlight
          rectangleClassName="border-primary"
          pointerClassName="text-primary"
        >
          <span className="px-1">indie hackers</span>
        </PointerHighlight>
        .
      </p>
    </Stage>
  ),
};

export const MultiWord: Story = {
  render: () => (
    <Stage>
      <p className="text-foreground max-w-2xl text-center text-3xl font-semibold">
        A template forged from{" "}
        <PointerHighlight>
          <span className="px-1">obsessive attention to detail</span>
        </PointerHighlight>
        , the kind that surprises clients.
      </p>
    </Stage>
  ),
};

export const Hero: Story = {
  render: () => (
    <Stage>
      <h1 className="text-foreground text-center text-6xl font-bold">
        <PointerHighlight>
          <span className="px-2">Indiecrafts</span>
        </PointerHighlight>
      </h1>
    </Stage>
  ),
};
