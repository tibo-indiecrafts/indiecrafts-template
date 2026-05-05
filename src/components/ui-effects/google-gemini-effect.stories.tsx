import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { GoogleGeminiEffect } from "./google-gemini-effect";

const meta: Meta<typeof GoogleGeminiEffect> = {
  title: "UI Effects/Particles & Effects/GoogleGeminiEffect",
  component: GoogleGeminiEffect,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GoogleGeminiEffect>;

const Demo = ({
  title,
  description,
  className,
  scrollSpan = "0,0.8",
  startBias = "0.2,0.15,0.1,0.05,0",
  endValue = 1.2,
}: {
  title?: string;
  description?: string;
  className?: string;
  scrollSpan?: string;
  startBias?: string;
  endValue?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [scrollStart, scrollEnd] = scrollSpan.split(",").map(Number) as [number, number];
  const biases = startBias.split(",").map(Number);

  const pathLengthFirst = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    [biases[0], endValue],
  );
  const pathLengthSecond = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    [biases[1], endValue],
  );
  const pathLengthThird = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    [biases[2], endValue],
  );
  const pathLengthFourth = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    [biases[3], endValue],
  );
  const pathLengthFifth = useTransform(
    scrollYProgress,
    [scrollStart, scrollEnd],
    [biases[4], endValue],
  );

  return (
    <div ref={ref} className="bg-background relative h-[400vh] w-full overflow-clip">
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title={title}
        description={description}
        className={className}
      />
    </div>
  );
};

/**
 * Default — scroll the canvas to animate the five SVG paths from start to
 * end. `pathLengths` is an array of five `MotionValue<number>` (typically
 * driven by `useScroll` + `useTransform`).
 */
export const Default: Story = {
  render: () => (
    <Demo
      title="Build with Indiecrafts"
      description="Scroll to animate the SVG paths along your journey."
    />
  ),
};

/** Custom copy — both `title` and `description` accept any string. */
export const CustomCopy: Story = {
  render: () => (
    <Demo
      title="Five colourful threads"
      description="The SVG draws progressively as the user scrolls past the section."
    />
  ),
};

/** Fallback copy — omit `title` and `description` to see the built-in defaults. */
export const FallbackCopy: Story = {
  render: () => <Demo />,
};

/**
 * Eager draw — paths reach full length at 30% of scroll instead of 80%, so
 * the animation completes early and the user can read the final composition
 * for longer.
 */
export const EagerDraw: Story = {
  render: () => (
    <Demo
      title="Eager animation"
      description="Paths complete by 30% of scroll progress."
      scrollSpan="0,0.3"
      startBias="0.4,0.35,0.3,0.25,0.2"
    />
  ),
};
