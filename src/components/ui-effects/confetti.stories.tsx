import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Confetti, ConfettiButton, type ConfettiRef } from "./confetti";

const meta: Meta<typeof Confetti> = {
  title: "UI Effects/Particles & Effects/Confetti",
  component: Confetti,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Confetti>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card flex h-[300px] w-[400px] items-center justify-center rounded-2xl border">
    {children}
  </div>
);

/** Default — confetti fires automatically on mount; persists for ~3s. */
export const Default: Story = {
  render: () => (
    <Stage>
      <p className="text-muted-foreground text-sm">Mounted ✓ Confetti fired</p>
      <Confetti className="absolute inset-0 size-full" />
    </Stage>
  ),
};

/**
 * Manual fire — `manualstart` skips the auto-trigger; the parent calls
 * `ref.current.fire(opts)` to launch confetti on demand.
 */
export const ManualFire: Story = {
  render: () => {
    const Demo = () => {
      const ref = useRef<ConfettiRef>(null);
      return (
        <Stage>
          <Button onClick={() => ref.current?.fire()}>Celebrate</Button>
          <Confetti
            ref={ref}
            className="pointer-events-none absolute inset-0 size-full"
            manualstart
          />
        </Stage>
      );
    };
    return <Demo />;
  },
};

/** ConfettiButton — turnkey trigger; click anywhere on the button. */
export const ButtonHelper: Story = {
  render: () => (
    <Stage>
      <ConfettiButton>Click me 🎉</ConfettiButton>
    </Stage>
  ),
};

/**
 * Custom palette + heavier burst — pass `options` to override the
 * canvas-confetti emitter parameters.
 */
export const CustomBurst: Story = {
  render: () => (
    <Stage>
      <ConfettiButton
        options={{
          particleCount: 200,
          spread: 90,
          colors: ["#22d3ee", "#a855f7", "#facc15", "#10b981", "#ef4444"],
        }}
      >
        Big burst
      </ConfettiButton>
    </Stage>
  ),
};

/**
 * Top emitter — origin near the top of the viewport, particles rain down.
 */
export const TopRain: Story = {
  render: () => {
    const Demo = () => {
      const ref = useRef<ConfettiRef>(null);
      return (
        <Stage>
          <Button
            onClick={() =>
              ref.current?.fire({
                particleCount: 120,
                spread: 360,
                origin: { x: 0.5, y: 0 },
                gravity: 1.2,
              })
            }
          >
            Rain down
          </Button>
          <Confetti
            ref={ref}
            className="pointer-events-none absolute inset-0 size-full"
            manualstart
          />
        </Stage>
      );
    };
    return <Demo />;
  },
};
