import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NumberTicker } from "./number-ticker";

const meta: Meta<typeof NumberTicker> = {
  title: "UI Effects/Loaders & Progress/NumberTicker",
  component: NumberTicker,
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: { type: "number" } },
    startValue: { control: { type: "number" } },
    direction: { control: "inline-radio", options: ["up", "down"] },
    decimalPlaces: { control: { type: "range", min: 0, max: 4, step: 1 } },
    delay: { control: { type: "range", min: 0, max: 3, step: 0.25 } },
  },
};
export default meta;

type Story = StoryObj<typeof NumberTicker>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[260px] w-full items-center justify-center p-10">
    {children}
  </div>
);

export const Default: Story = {
  args: { value: 1234 },
  render: (args) => (
    <Stage>
      <NumberTicker {...args} className="text-foreground text-7xl font-semibold" />
    </Stage>
  ),
};

export const CountDown: Story = {
  args: { value: 0, startValue: 100, direction: "down" },
  render: (args) => (
    <Stage>
      <NumberTicker {...args} className="text-foreground text-7xl font-semibold" />
    </Stage>
  ),
};

export const Decimals: Story = {
  args: { value: 4.95, decimalPlaces: 2 },
  render: (args) => (
    <Stage>
      <NumberTicker {...args} className="text-foreground text-7xl font-semibold" />
    </Stage>
  ),
};

export const Delayed: Story = {
  args: { value: 9999, delay: 1.5 },
  render: (args) => (
    <Stage>
      <NumberTicker {...args} className="text-foreground text-7xl font-semibold" />
    </Stage>
  ),
};

export const StatRow: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="bg-background grid w-full grid-cols-1 gap-8 p-10 md:grid-cols-3">
      {[
        { value: 250, label: "Client sites shipped" },
        { value: 4.9, decimals: 1, label: "Average rating" },
        { value: 99, label: "Lighthouse score" },
      ].map((s) => (
        <div
          key={s.label}
          className="border-border bg-card flex flex-col items-center justify-center rounded-2xl border p-8 text-center"
        >
          <NumberTicker
            value={s.value}
            decimalPlaces={s.decimals ?? 0}
            className="text-foreground text-5xl font-bold"
          />
          <p className="text-muted-foreground mt-2 text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  ),
};
