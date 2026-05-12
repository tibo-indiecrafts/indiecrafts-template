import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShootingStars } from "./shooting-stars";

const meta: Meta<typeof ShootingStars> = {
  title: "UI Effects/Backgrounds/ShootingStars",
  component: ShootingStars,
  parameters: { layout: "fullscreen" },
  argTypes: {
    minSpeed: { control: { type: "range", min: 5, max: 60, step: 1 } },
    maxSpeed: { control: { type: "range", min: 10, max: 80, step: 2 } },
    minDelay: { control: { type: "range", min: 200, max: 5000, step: 100 } },
    maxDelay: { control: { type: "range", min: 500, max: 10000, step: 100 } },
    starColor: { control: "color" },
    trailColor: { control: "color" },
    starWidth: { control: { type: "range", min: 4, max: 40, step: 1 } },
    starHeight: { control: { type: "range", min: 1, max: 8, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof ShootingStars>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex min-h-[480px] w-full items-center justify-center overflow-hidden bg-slate-950">
    {children}
  </div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="relative z-10 px-6 text-center">
    <h2 className="text-3xl font-semibold text-white">{title}</h2>
    <p className="mt-2 max-w-md text-sm text-white/70">{body}</p>
  </div>
);

export const Default: Story = {
  args: {
    minSpeed: 10,
    maxSpeed: 30,
    minDelay: 1200,
    maxDelay: 4200,
    starColor: "#9E00FF",
    trailColor: "#2EB9DF",
  },
  render: (args) => (
    <Stage>
      <ShootingStars {...args} />
      <Body
        title="Stars in motion"
        body="One star at a time slides across the sky from a random edge."
      />
    </Stage>
  ),
};

export const Frequent: Story = {
  args: { minDelay: 400, maxDelay: 1500 },
  render: (args) => (
    <Stage>
      <ShootingStars {...args} />
      <Body title="Frequent" body="Shorter delay window between streaks." />
    </Stage>
  ),
};

export const BrandColors: Story = {
  args: { starColor: "#4f46e5", trailColor: "#818cf8" },
  render: (args) => (
    <Stage>
      <ShootingStars {...args} />
      <Body title="Brand streaks" body="Indigo head with a lighter trail." />
    </Stage>
  ),
};

export const SlowChunky: Story = {
  args: { minSpeed: 5, maxSpeed: 12, starWidth: 24, starHeight: 3 },
  render: (args) => (
    <Stage>
      <ShootingStars {...args} />
      <Body title="Heavier streaks" body="Bigger, slower stars." />
    </Stage>
  ),
};
