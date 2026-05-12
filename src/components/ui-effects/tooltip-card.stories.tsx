/* eslint-disable @next/next/no-img-element -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sparkles } from "lucide-react";
import { Tooltip } from "./tooltip-card";

const meta: Meta<typeof Tooltip> = {
  title: "UI Effects/Hover & Interactions/TooltipCard",
  component: Tooltip,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[260px] w-full items-center justify-center p-12">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <p className="text-foreground text-base">
        We use{" "}
        <Tooltip content="A Next.js template that turns weekend ideas into client sites.">
          <span className="cursor-help underline decoration-dotted underline-offset-4">
            Indiecrafts
          </span>
        </Tooltip>{" "}
        for everything from launch pages to investor decks.
      </p>
    </Stage>
  ),
};

export const RichContent: Story = {
  render: () => (
    <Stage>
      <p className="text-foreground text-base">
        Hover{" "}
        <Tooltip
          content={
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-amber-400" aria-hidden />
                Indiecrafts Pro
              </div>
              <p className="text-xs text-white/70">
                Includes the agency dashboard, multi-tenant routing, and the Stripe
                integration kit.
              </p>
            </div>
          }
        >
          <span className="cursor-help underline decoration-dotted underline-offset-4">
            this badge
          </span>
        </Tooltip>{" "}
        for plan details.
      </p>
    </Stage>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Stage>
      <p className="text-foreground text-base">
        Visit{" "}
        <Tooltip
          content={
            <div className="space-y-2">
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80"
                alt=""
                className="aspect-[16/9] w-full rounded-md object-cover"
              />
              <p className="text-xs text-white/80">
                Atelier in Bordeaux — a 19th-century carriage house turned design studio.
              </p>
            </div>
          }
        >
          <span className="cursor-help underline decoration-dotted underline-offset-4">
            our atelier
          </span>
        </Tooltip>{" "}
        next time you&apos;re in town.
      </p>
    </Stage>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Stage>
      <p className="text-foreground max-w-md text-center text-base">
        Built with{" "}
        <Tooltip content="React Compiler auto-memoises components.">
          <span className="cursor-help underline decoration-dotted underline-offset-4">
            React 19
          </span>
        </Tooltip>{" "}
        and{" "}
        <Tooltip content="Tailwind v4 with @theme inline tokens.">
          <span className="cursor-help underline decoration-dotted underline-offset-4">
            Tailwind 4
          </span>
        </Tooltip>{" "}
        — typed end to end.
      </p>
    </Stage>
  ),
};
