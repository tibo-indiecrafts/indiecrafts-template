import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  BellRing,
  Bot,
  Cloud,
  GitBranch,
  Globe,
  Lock,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import { BentoGrid, BentoGridItem } from "./bento-grid";

const meta: Meta<typeof BentoGrid> = {
  title: "UI Effects/Cards/BentoGrid",
  component: BentoGrid,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BentoGrid>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background min-h-svh w-full p-6 md:p-12">{children}</div>
);

const GradientGlow = ({ from, to }: { from: string; to: string }) => (
  <div
    className="relative h-full min-h-[6rem] w-full flex-1 overflow-hidden rounded-xl"
    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
  >
    <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-white/20 blur-2xl" />
    <div className="absolute -top-6 -left-6 size-24 rounded-full bg-white/10 blur-xl" />
  </div>
);

const ChatPreview = () => (
  <div className="bg-card flex h-full min-h-[6rem] flex-1 flex-col gap-2 rounded-xl border p-4">
    <div className="flex items-start gap-2">
      <div className="bg-foreground/10 size-6 shrink-0 rounded-full" />
      <div className="bg-foreground/5 max-w-[70%] rounded-2xl rounded-tl-sm px-3 py-1.5 text-xs">
        Hey! How&apos;s the rollout going?
      </div>
    </div>
    <div className="flex items-start justify-end gap-2">
      <div className="bg-foreground text-background max-w-[70%] rounded-2xl rounded-tr-sm px-3 py-1.5 text-xs">
        Smooth — 80% adoption already.
      </div>
    </div>
    <div className="flex items-start gap-2">
      <div className="bg-foreground/10 size-6 shrink-0 rounded-full" />
      <div className="bg-foreground/5 max-w-[70%] rounded-2xl rounded-tl-sm px-3 py-1.5 text-xs">
        🎉
      </div>
    </div>
  </div>
);

const StatChart = () => (
  <div className="bg-card relative flex h-full min-h-[6rem] flex-1 items-end gap-1 overflow-hidden rounded-xl border p-4">
    {[40, 56, 32, 70, 88, 60, 95].map((h, i) => (
      <div
        key={i}
        className="bg-foreground/70 flex-1 rounded-t-sm"
        style={{ height: `${h}%` }}
      />
    ))}
  </div>
);

const KeySteps = () => (
  <div className="bg-card flex h-full min-h-[6rem] flex-1 flex-col justify-center gap-2 rounded-xl border p-4 text-xs">
    {["Listen for trigger", "Apply policy", "Audit + ship"].map((s, i) => (
      <div key={s} className="flex items-center gap-2">
        <div className="bg-foreground text-background flex size-5 items-center justify-center rounded-full text-[10px] font-semibold">
          {i + 1}
        </div>
        <span>{s}</span>
      </div>
    ))}
  </div>
);

const Globe3D = () => (
  <div className="bg-card relative flex h-full min-h-[6rem] flex-1 items-center justify-center overflow-hidden rounded-xl border">
    <div className="bg-foreground/10 absolute size-32 rounded-full blur-3xl" />
    <Globe className="text-foreground/60 size-20" strokeWidth={1} />
  </div>
);

const SparkRow = () => (
  <div className="bg-card flex h-full min-h-[6rem] flex-1 items-center justify-around overflow-hidden rounded-xl border p-4">
    {[BellRing, Zap, Bot, Sparkles].map((Icon, i) => (
      <div
        key={i}
        className="bg-foreground/10 flex size-10 items-center justify-center rounded-lg"
      >
        <Icon className="size-5" />
      </div>
    ))}
  </div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <BentoGrid>
        <BentoGridItem
          title="Real-time chat"
          description="Threads, mentions, and emoji reactions out of the box."
          header={<ChatPreview />}
          icon={<MessageSquare className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="Lightning fast"
          description="Sub-100ms p99 across every endpoint, every region."
          header={<GradientGlow from="#0ea5e9" to="#a855f7" />}
          icon={<Zap className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="Global edge"
          description="42 PoPs and counting — your users never wait."
          header={<Globe3D />}
          icon={<Globe className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="Workflow studio"
          description="Drag-and-drop automations that fit on a single screen."
          header={<KeySteps />}
          icon={<Sparkles className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="Built-in analytics"
          description="See what matters without piping events anywhere else."
          header={<StatChart />}
          icon={<Cloud className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="Integrations"
          description="Slack, GitHub, Linear — and 60+ more."
          header={<SparkRow />}
          icon={<GitBranch className="text-muted-foreground size-4" />}
        />
      </BentoGrid>
    </Frame>
  ),
};

export const Featured: Story = {
  render: () => (
    <Frame>
      <BentoGrid className="md:auto-rows-[20rem]">
        <BentoGridItem
          title="Real-time chat"
          description="Threads, mentions, and emoji reactions out of the box."
          header={<ChatPreview />}
          icon={<MessageSquare className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          className="md:col-span-2"
          title="Built for global teams"
          description="42 PoPs, automatic failover, and replication that actually keeps up. Sub-100ms p99 latency on every endpoint, every region."
          header={
            <div className="bg-card relative flex h-full min-h-[10rem] flex-1 items-center justify-center overflow-hidden rounded-xl border">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(14,165,233,.4), transparent 50%), radial-gradient(circle at 70% 70%, rgba(168,85,247,.4), transparent 50%)",
                }}
              />
              <Globe className="text-foreground relative size-32" strokeWidth={0.5} />
            </div>
          }
          icon={<Globe className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          className="md:col-span-2"
          title="One-click integrations"
          description="Slack, GitHub, Linear — and 60+ more. Drop a key, hit save, ship."
          header={<SparkRow />}
          icon={<GitBranch className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="SOC2 + HIPAA ready"
          description="The audits are done so your launch isn't blocked."
          header={<GradientGlow from="#10b981" to="#0ea5e9" />}
          icon={<Lock className="text-muted-foreground size-4" />}
        />
      </BentoGrid>
    </Frame>
  ),
};

export const Compact: Story = {
  render: () => (
    <Frame>
      <BentoGrid>
        <BentoGridItem
          title="Lightning fast"
          description="Sub-100ms p99 across every endpoint, every region."
          header={<GradientGlow from="#0ea5e9" to="#a855f7" />}
          icon={<Zap className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="Real-time chat"
          description="Threads, mentions, and emoji reactions out of the box."
          header={<ChatPreview />}
          icon={<MessageSquare className="text-muted-foreground size-4" />}
        />
        <BentoGridItem
          title="Built-in analytics"
          description="See what matters without piping events anywhere else."
          header={<StatChart />}
          icon={<Cloud className="text-muted-foreground size-4" />}
        />
      </BentoGrid>
    </Frame>
  ),
};
