import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bell, CreditCard, MessageCircle, ShieldCheck, Star, Zap } from "lucide-react";
import { AnimatedList } from "./animated-list";

const meta: Meta<typeof AnimatedList> = {
  title: "UI Effects/Data display/AnimatedList",
  component: AnimatedList,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AnimatedList>;

type Notification = {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  tone: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: CreditCard,
    title: "Payment received",
    body: "$1,250 from Acme Inc.",
    tone: "bg-emerald-500",
  },
  {
    id: 2,
    icon: MessageCircle,
    title: "New message",
    body: "Sofia replied to your thread.",
    tone: "bg-sky-500",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Security alert",
    body: "Sign-in from a new device.",
    tone: "bg-amber-500",
  },
  {
    id: 4,
    icon: Bell,
    title: "Reminder",
    body: "Stand-up starts in 5 min.",
    tone: "bg-violet-500",
  },
  {
    id: 5,
    icon: Star,
    title: "New star",
    body: "@peduarte starred your repo.",
    tone: "bg-yellow-500",
  },
  {
    id: 6,
    icon: Zap,
    title: "Build complete",
    body: "Production build finished in 12s.",
    tone: "bg-pink-500",
  },
];

const Card = ({ n }: { n: Notification }) => (
  <figure className="bg-card relative mx-auto flex w-[340px] items-center gap-3 rounded-2xl border p-3 shadow-sm">
    <div
      className={`text-background flex size-10 items-center justify-center rounded-xl ${n.tone}`}
    >
      <n.icon className="size-5" />
    </div>
    <figcaption className="flex flex-col">
      <span className="text-sm font-medium">{n.title}</span>
      <span className="text-muted-foreground text-xs">{n.body}</span>
    </figcaption>
  </figure>
);

/** Default — 1s delay between item reveals; six staggered notifications. */
export const Default: Story = {
  render: () => (
    <AnimatedList className="h-[420px] w-[360px]">
      {NOTIFICATIONS.map((n) => (
        <Card key={n.id} n={n} />
      ))}
    </AnimatedList>
  ),
};

/** Fast — 250ms delay; rapid-fire reveals (good for short hero animations). */
export const Fast: Story = {
  render: () => (
    <AnimatedList className="h-[420px] w-[360px]" delay={250}>
      {NOTIFICATIONS.map((n) => (
        <Card key={n.id} n={n} />
      ))}
    </AnimatedList>
  ),
};

/** Slow — 2s delay; cinematic pacing for marketing pages. */
export const Slow: Story = {
  render: () => (
    <AnimatedList className="h-[420px] w-[360px]" delay={2000}>
      {NOTIFICATIONS.map((n) => (
        <Card key={n.id} n={n} />
      ))}
    </AnimatedList>
  ),
};

/** Minimal — three plain text items, default cadence. */
export const TextOnly: Story = {
  render: () => (
    <AnimatedList className="h-[200px] w-[260px]">
      {["First", "Second", "Third"].map((label, i) => (
        <div key={i} className="bg-card rounded-md border px-4 py-2 text-center text-sm">
          {label}
        </div>
      ))}
    </AnimatedList>
  ),
};
