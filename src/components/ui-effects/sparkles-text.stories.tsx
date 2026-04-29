import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SparklesText } from "./sparkles-text";

const meta: Meta<typeof SparklesText> = {
  title: "UI Effects/SparklesText",
  component: SparklesText,
  parameters: { layout: "centered" },
  argTypes: {
    sparklesCount: { control: { type: "range", min: 2, max: 40, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof SparklesText>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background text-foreground flex min-h-[280px] w-full items-center justify-center p-12">
    {children}
  </div>
);

/**
 * Default — heading text with 10 random sparkles drifting around it. The
 * sparkles regenerate after each lifespan; pass any node as children.
 */
export const Default: Story = {
  args: { sparklesCount: 10 },
  render: (args) => (
    <Stage>
      <SparklesText {...args}>Indiecrafts</SparklesText>
    </Stage>
  ),
};

/**
 * Brand colours — `colors` retunes the sparkle palette to two indigo stops
 * matching the template&apos;s `oklch(0.55 0.18 260)` brand. SVG fill
 * attributes don&apos;t resolve CSS vars so the hex is hard-coded.
 */
export const BrandColors: Story = {
  args: {
    sparklesCount: 14,
    colors: { first: "#4f46e5", second: "#818cf8" },
  },
  render: (args) => (
    <Stage>
      <SparklesText {...args}>Brand sparkles</SparklesText>
    </Stage>
  ),
};

/** Heavy — `sparklesCount={28}` for an over-the-top hero look. */
export const HeavySparkles: Story = {
  args: { sparklesCount: 28 },
  render: (args) => (
    <Stage>
      <SparklesText {...args}>Magic studio</SparklesText>
    </Stage>
  ),
};

/** Smaller scale — `className` shrinks the heading. */
export const Compact: Story = {
  args: { sparklesCount: 8 },
  render: (args) => (
    <Stage>
      <SparklesText {...args} className="text-3xl">
        Subscription tier
      </SparklesText>
    </Stage>
  ),
};

/** Hero scale — `className="text-8xl"` for a display headline. */
export const Hero: Story = {
  args: { sparklesCount: 20 },
  render: (args) => (
    <Stage>
      <SparklesText {...args} className="text-8xl">
        Indie
      </SparklesText>
    </Stage>
  ),
};
