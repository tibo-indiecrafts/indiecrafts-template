/* eslint-disable @typescript-eslint/ban-ts-comment -- ts-nocheck below */
// @ts-nocheck -- Aceternity / MagicUI upstream; type quirks (React 19 ref-null types, missing JSX namespace, etc.) accepted as-is.
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackgroundBeamsWithCollision } from "./background-beams-with-collision";

const meta: Meta<typeof BackgroundBeamsWithCollision> = {
  title: "UI Effects/Backgrounds/BackgroundBeamsWithCollision",
  component: BackgroundBeamsWithCollision,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BackgroundBeamsWithCollision>;

export const Default: Story = {
  render: () => (
    <BackgroundBeamsWithCollision className="h-[60vh]">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Beams meet a horizon, sparks fly.
      </h2>
    </BackgroundBeamsWithCollision>
  ),
};

export const FullHero: Story = {
  render: () => (
    <BackgroundBeamsWithCollision className="h-screen">
      <div className="flex max-w-2xl flex-col items-center gap-4 px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
          What&apos;s cooler than beams?
          <br />
          <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Exploding beams.
          </span>
        </h2>
        <p className="text-muted-foreground max-w-md">
          Beams crash into the floor with sparks, like a digital firework display.
          Suitable for marketing pages where you need a hero that punches above its
          weight.
        </p>
        <button className="bg-foreground text-background mt-2 rounded-full px-5 py-2.5 text-sm font-medium">
          Get started
        </button>
      </div>
    </BackgroundBeamsWithCollision>
  ),
};

export const EmptyStage: Story = {
  render: () => <BackgroundBeamsWithCollision className="h-[40vh]" />,
};
