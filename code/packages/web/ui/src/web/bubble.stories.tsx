import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bubble, BubbleContent, BubbleGroup } from "./bubble";
import docs from "./bubble.md?raw";

const VARIANTS = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "destructive",
] as const;

const meta = {
  title: "Web/UI/Bubble",
  component: Bubble,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Bubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <BubbleGroup className="w-80">
      <Bubble variant="secondary" align="start">
        <BubbleContent>Hey — did the order ship yet?</BubbleContent>
      </Bubble>
      <Bubble variant="default" align="end">
        <BubbleContent>
          Yes! Tracking is on its way to your inbox.
        </BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      {VARIANTS.map((variant) => (
        <Bubble key={variant} variant={variant}>
          <BubbleContent>{variant}</BubbleContent>
        </Bubble>
      ))}
    </div>
  ),
};
