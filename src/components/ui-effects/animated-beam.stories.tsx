import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef } from "react";
import { AnimatedBeam } from "./animated-beam";

const meta: Meta<typeof AnimatedBeam> = {
  title: "UI Effects/Particles & Effects/AnimatedBeam",
  component: AnimatedBeam,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AnimatedBeam>;

const Anchor = ({
  label,
  innerRef,
  className,
}: {
  label: string;
  innerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) => (
  <div
    ref={innerRef}
    className={`bg-background flex size-12 items-center justify-center rounded-full border text-sm font-medium shadow-sm ${className ?? ""}`}
  >
    {label}
  </div>
);

/**
 * Default — single straight beam from A to B. Demonstrates the minimum API
 * surface: `containerRef`, `fromRef`, `toRef`.
 */
export const Default: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    return (
      <div
        ref={containerRef}
        className="bg-muted/40 relative flex h-64 w-[480px] items-center justify-between rounded-xl px-12"
      >
        <Anchor label="A" innerRef={fromRef} />
        <Anchor label="B" innerRef={toRef} />
        <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
      </div>
    );
  },
};

/** `curvature={75}` arches the beam upward — useful for non-linear flows. */
export const Curved: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    return (
      <div
        ref={containerRef}
        className="bg-muted/40 relative flex h-64 w-[480px] items-center justify-between rounded-xl px-12"
      >
        <Anchor label="A" innerRef={fromRef} />
        <Anchor label="B" innerRef={toRef} />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
          curvature={75}
        />
      </div>
    );
  },
};

/** `reverse` flips the gradient sweep direction. */
export const Reverse: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    return (
      <div
        ref={containerRef}
        className="bg-muted/40 relative flex h-64 w-[480px] items-center justify-between rounded-xl px-12"
      >
        <Anchor label="A" innerRef={fromRef} />
        <Anchor label="B" innerRef={toRef} />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
          reverse
        />
      </div>
    );
  },
};

/**
 * Hub-and-spoke — three peripheral anchors all beaming into a central node.
 * Common pattern for diagrams that show a coordinator / router.
 */
export const HubAndSpoke: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    return (
      <div
        ref={containerRef}
        className="bg-muted/40 relative grid h-[360px] w-[480px] grid-cols-3 grid-rows-3 place-items-center rounded-xl"
      >
        <div className="col-start-2 row-start-1">
          <Anchor label="A" innerRef={topRef} />
        </div>
        <div className="col-start-1 row-start-3">
          <Anchor label="B" innerRef={leftRef} />
        </div>
        <div className="col-start-3 row-start-3">
          <Anchor label="C" innerRef={rightRef} />
        </div>
        <div className="col-start-2 row-start-2">
          <Anchor
            label="HUB"
            innerRef={centerRef}
            className="bg-foreground text-background border-foreground size-14"
          />
        </div>
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={topRef}
          toRef={centerRef}
          duration={4}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={leftRef}
          toRef={centerRef}
          duration={5}
          delay={1}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={rightRef}
          toRef={centerRef}
          duration={6}
          delay={2}
        />
      </div>
    );
  },
};

/**
 * Custom palette — `gradientStartColor` and `gradientStopColor` retune the
 * sweep, and a thicker `pathWidth` reads better against busy backgrounds.
 */
export const CustomColors: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    return (
      <div
        ref={containerRef}
        className="relative flex h-64 w-[480px] items-center justify-between rounded-xl bg-zinc-950 px-12"
      >
        <Anchor label="A" innerRef={fromRef} className="bg-zinc-900 text-zinc-100" />
        <Anchor label="B" innerRef={toRef} className="bg-zinc-900 text-zinc-100" />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
          pathColor="#27272a"
          pathWidth={3}
          gradientStartColor="#22d3ee"
          gradientStopColor="#a855f7"
          duration={4}
        />
      </div>
    );
  },
};
