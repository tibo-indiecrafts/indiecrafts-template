import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScrollStack, ScrollStackItem } from "./index";

const meta: Meta<typeof ScrollStack> = {
  title: "UI Effects/Animations/ScrollStack",
  component: ScrollStack,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrollStack>;

const CARDS = [
  { title: "Card 1", body: "This is the first card in the stack." },
  { title: "Card 2", body: "Each card pins, scales, and stacks as you scroll." },
  { title: "Card 3", body: "Lenis drives the smooth wheel/touch easing." },
  { title: "Card 4", body: "Try adding rotationAmount or blurAmount for depth." },
  { title: "Card 5", body: "The last card releases the pin at the spacer." },
];

const palette = [
  "from-indigo-500 to-violet-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-cyan-500",
];

export const Showcase: Story = {
  render: () => (
    <div className="h-dvh w-dvw bg-neutral-100">
      <ScrollStack>
        {CARDS.map((c, i) => (
          <ScrollStackItem
            key={c.title}
            itemClassName={`bg-gradient-to-br ${palette[i]} text-white`}
          >
            <h2 className="text-3xl font-bold">{c.title}</h2>
            <p className="mt-3 text-lg text-white/85">{c.body}</p>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  ),
};

export const WithRotationAndBlur: Story = {
  render: () => (
    <div className="h-dvh w-dvw bg-neutral-950 text-white">
      <ScrollStack rotationAmount={2} blurAmount={1.5} baseScale={0.9}>
        {CARDS.map((c, i) => (
          <ScrollStackItem
            key={c.title}
            itemClassName="bg-neutral-900 border border-white/10"
          >
            <h2 className="text-3xl font-bold">{c.title}</h2>
            <p className="mt-3 text-lg text-white/70">{c.body}</p>
            <p className="mt-2 text-sm text-white/40">Index {i}</p>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  ),
};
