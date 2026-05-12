import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heart, Sparkles, Zap } from "lucide-react";
import { Pointer } from "./pointer";

const meta: Meta<typeof Pointer> = {
  title: "UI Effects/Hover & Interactions/Pointer",
  component: Pointer,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Pointer>;

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`border-border bg-card text-foreground relative w-[420px] rounded-2xl border p-8 shadow-sm ${className ?? ""}`}
  >
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Card>
      <Pointer />
      <h3 className="text-xl font-semibold">Hover this card</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        The system cursor is hidden while inside; a custom arrow follows instead.
      </p>
    </Card>
  ),
};

export const HeartCursor: Story = {
  render: () => (
    <Card>
      <Pointer>
        <Heart className="size-6 fill-rose-500 text-rose-500" aria-hidden />
      </Pointer>
      <h3 className="text-xl font-semibold">Heart cursor</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        Pass children to render a custom cursor (icon, emoji, even a div).
      </p>
    </Card>
  ),
};

export const Sparkle: Story = {
  render: () => (
    <Card>
      <Pointer>
        <Sparkles className="size-6 text-amber-400" aria-hidden />
      </Pointer>
      <h3 className="text-xl font-semibold">Sparkly hover</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        Useful for celebratory moments — onboarding cards, prize tiers, etc.
      </p>
    </Card>
  ),
};

export const Emoji: Story = {
  render: () => (
    <Card>
      <Pointer>
        <span className="text-3xl">🚀</span>
      </Pointer>
      <h3 className="text-xl font-semibold">Rocket fuel</h3>
      <p className="text-muted-foreground mt-2 text-sm">
        Kid-friendly cursors are just an emoji span away.
      </p>
    </Card>
  ),
};

export const SideBySide: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background flex min-h-[400px] w-full items-center justify-center gap-6 p-10">
      <Card className="w-[300px]">
        <Pointer>
          <Heart className="size-6 fill-rose-500 text-rose-500" aria-hidden />
        </Pointer>
        <h3 className="text-lg font-semibold">Hover left</h3>
        <p className="text-muted-foreground mt-2 text-sm">Heart cursor.</p>
      </Card>
      <Card className="w-[300px]">
        <Pointer>
          <Zap className="size-6 fill-yellow-400 text-yellow-500" aria-hidden />
        </Pointer>
        <h3 className="text-lg font-semibold">Hover right</h3>
        <p className="text-muted-foreground mt-2 text-sm">Lightning cursor.</p>
      </Card>
    </div>
  ),
};
