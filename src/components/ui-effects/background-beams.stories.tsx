import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackgroundBeams } from "./background-beams";

const meta: Meta<typeof BackgroundBeams> = {
  title: "UI Effects/BackgroundBeams",
  component: BackgroundBeams,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BackgroundBeams>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 antialiased">
    {children}
  </div>
);

/**
 * Default — the beams render as `position: absolute inset-0` and only show on
 * a darker stage. The `<Stage>` provides the contrasting background and
 * positions content above the SVG layer.
 */
export const Default: Story = {
  render: () => (
    <Stage>
      <div className="relative z-10 mx-auto max-w-2xl p-4 text-center">
        <h1 className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-4xl font-bold text-transparent md:text-7xl">
          Join the waitlist
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-400">
          Welcome to MailJet, the best transactional email service on the web.
          We provide reliable, scalable, and customisable email solutions for
          your business.
        </p>
      </div>
      <BackgroundBeams />
    </Stage>
  ),
};

/**
 * Empty stage — beams alone, no foreground content. Useful for verifying the
 * SVG paths animate as expected.
 */
export const EmptyStage: Story = {
  render: () => (
    <Stage>
      <BackgroundBeams />
    </Stage>
  ),
};

/**
 * Inside a card — passing `className` clips the beams to a smaller surface so
 * they can be used as a hero accent rather than a full-bleed backdrop.
 */
export const Card: Story = {
  render: () => (
    <div className="bg-background flex min-h-svh items-center justify-center p-6">
      <div className="relative h-[420px] w-[640px] overflow-hidden rounded-3xl bg-neutral-950">
        <BackgroundBeams className="rounded-3xl" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-semibold text-white">Card-sized hero</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Beams clipped via `overflow-hidden` on the parent.
          </p>
        </div>
      </div>
    </div>
  ),
};
