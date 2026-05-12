import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollProgress } from "./scroll-progress";

const meta: Meta<typeof ScrollProgress> = {
  title: "UI Effects/Loaders & Progress/ScrollProgress",
  component: ScrollProgress,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrollProgress>;

const LongPage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background h-[300vh] w-full">{children}</div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="text-foreground mx-auto max-w-2xl px-6 py-32">
    <h1 className="text-4xl font-bold">{title}</h1>
    <p className="text-muted-foreground mt-4 max-w-prose">{body}</p>
  </div>
);

export const Default: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress />
      <Body
        title="Scroll progress"
        body="Scroll up and down — the gradient bar at the top of the viewport tracks your progress through the page."
      />
    </LongPage>
  ),
};

export const BrandColor: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress className="from-primary via-primary to-brand-foreground" />
      <Body
        title="Brand-tinted bar"
        body="Tailwind brand tokens drive the gradient — rebrand by changing one CSS var."
      />
    </LongPage>
  ),
};

export const Thicker: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress className="h-1" />
      <Body
        title="Thicker bar"
        body="Default is 1px high; bump it via className for more presence."
      />
    </LongPage>
  ),
};

export const Bottom: Story = {
  render: () => (
    <LongPage>
      <ScrollProgress className="top-auto bottom-0" />
      <Body
        title="Bottom-pinned bar"
        body="Override the position with classes if you prefer the indicator at the bottom."
      />
    </LongPage>
  ),
};
