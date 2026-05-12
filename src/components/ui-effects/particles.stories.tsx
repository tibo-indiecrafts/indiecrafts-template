import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Particles } from "./particles";

const meta: Meta<typeof Particles> = {
  title: "UI Effects/Particles & Effects/Particles",
  component: Particles,
  parameters: { layout: "fullscreen" },
  argTypes: {
    quantity: { control: { type: "range", min: 20, max: 400, step: 10 } },
    staticity: { control: { type: "range", min: 10, max: 100, step: 5 } },
    ease: { control: { type: "range", min: 10, max: 100, step: 5 } },
    size: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    vx: { control: { type: "range", min: -2, max: 2, step: 0.1 } },
    vy: { control: { type: "range", min: -2, max: 2, step: 0.1 } },
    color: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof Particles>;

const Stage = ({
  children,
  dark = true,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <div
    className={`relative flex min-h-[460px] w-full items-center justify-center overflow-hidden ${
      dark ? "bg-slate-950" : "bg-background"
    }`}
  >
    {children}
  </div>
);

const Title = ({ text, dark = true }: { text: string; dark?: boolean }) => (
  <h2
    className={`relative text-3xl font-semibold ${dark ? "text-white" : "text-foreground"}`}
  >
    {text}
  </h2>
);

export const Default: Story = {
  args: { quantity: 100, color: "#ffffff" },
  render: (args) => (
    <Stage>
      <Particles {...args} className="absolute inset-0" />
      <Title text="Drifting stars" />
    </Stage>
  ),
};

export const Dense: Story = {
  args: { quantity: 300, color: "#ffffff" },
  render: (args) => (
    <Stage>
      <Particles {...args} className="absolute inset-0" />
      <Title text="Dense field" />
    </Stage>
  ),
};

export const Tinted: Story = {
  args: { quantity: 150, color: "#06b6d4" },
  render: (args) => (
    <Stage>
      <Particles {...args} className="absolute inset-0" />
      <Title text="Cyan dust" />
    </Stage>
  ),
};

export const Drifting: Story = {
  args: { quantity: 150, vx: 0.3, vy: -0.1, color: "#ffffff" },
  render: (args) => (
    <Stage>
      <Particles {...args} className="absolute inset-0" />
      <Title text="Drift right" />
    </Stage>
  ),
};

export const LightTheme: Story = {
  args: { quantity: 120, color: "#0f172a" },
  render: (args) => (
    <Stage dark={false}>
      <Particles {...args} className="absolute inset-0" />
      <Title text="Daytime particles" dark={false} />
    </Stage>
  ),
};
