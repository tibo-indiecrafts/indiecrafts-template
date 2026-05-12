import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SparklesText } from "./sparkles-text";

const meta: Meta<typeof SparklesText> = {
  title: "UI Effects/Text/SparklesText",
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

export const Default: Story = {
  args: { sparklesCount: 10 },
  render: (args) => (
    <Stage>
      <SparklesText {...args}>Indiecrafts</SparklesText>
    </Stage>
  ),
};

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

export const HeavySparkles: Story = {
  args: { sparklesCount: 28 },
  render: (args) => (
    <Stage>
      <SparklesText {...args}>Magic studio</SparklesText>
    </Stage>
  ),
};

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
