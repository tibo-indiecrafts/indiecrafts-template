/* eslint-disable @next/next/no-img-element -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DraggableCardBody, DraggableCardContainer } from "./draggable-card";

const meta: Meta<typeof DraggableCardBody> = {
  title: "UI Effects/Particles & Effects/DraggableCard",
  component: DraggableCardBody,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DraggableCardBody>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <DraggableCardContainer className="bg-background relative flex h-screen w-full items-center justify-center overflow-hidden">
    {children}
  </DraggableCardContainer>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <DraggableCardBody className="bg-card relative h-80 w-72 rounded-2xl border p-6 shadow-xl">
        <h3 className="text-lg font-semibold">Drag me</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Click and drag the card. It rotates with velocity and snaps back via spring
          physics when released.
        </p>
      </DraggableCardBody>
    </Frame>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Frame>
      <DraggableCardBody className="bg-card relative h-96 w-72 overflow-hidden rounded-2xl border shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80"
          alt=""
          className="h-2/3 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="text-base font-semibold">Polaroid drag</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Photograph styling + drag interaction.
          </p>
        </div>
      </DraggableCardBody>
    </Frame>
  ),
};

export const Stack: Story = {
  render: () => (
    <Frame>
      <div className="relative">
        {[
          { rotate: -6, x: -12, y: 0, label: "Card A" },
          { rotate: 0, x: 0, y: 0, label: "Card B" },
          { rotate: 6, x: 12, y: 0, label: "Card C" },
        ].map(({ rotate, x, y, label }) => (
          <DraggableCardBody
            key={label}
            className="bg-card absolute h-72 w-64 rounded-2xl border p-6 shadow-xl"
          >
            <div
              style={{ transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)` }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            >
              <p className="text-2xl font-bold">{label}</p>
              <p className="text-muted-foreground mt-2 text-xs">
                Drag any card out of the stack.
              </p>
            </div>
          </DraggableCardBody>
        ))}
      </div>
    </Frame>
  ),
};
