import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SpinningText } from "./spinning-text";

const meta: Meta<typeof SpinningText> = {
  title: "UI Effects/Text/SpinningText",
  component: SpinningText,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 2, max: 30, step: 1 } },
    reverse: { control: "boolean" },
    radius: { control: { type: "range", min: 3, max: 12, step: 0.5 } },
  },
};
export default meta;

type Story = StoryObj<typeof SpinningText>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background text-foreground flex min-h-[280px] w-full items-center justify-center p-12">
    {children}
  </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-48 w-48 items-center justify-center text-sm font-medium">
    {children}
  </div>
);

/**
 * Default — letters arranged on a circle that rotates 360° every 10s. The
 * `radius` (in `ch` units) controls how wide the circle is; the parent must
 * be a fixed-size square.
 */
export const Default: Story = {
  args: { duration: 10, radius: 5 },
  render: (args) => (
    <Stage>
      <Frame>
        <SpinningText {...args}>Indiecrafts • Build • Ship • </SpinningText>
      </Frame>
    </Stage>
  ),
};

/** Reverse — `reverse` flips the spin direction. */
export const Reverse: Story = {
  args: { duration: 10, reverse: true },
  render: (args) => (
    <Stage>
      <Frame>
        <SpinningText {...args}>{"  • Spin the other way • "}</SpinningText>
      </Frame>
    </Stage>
  ),
};

/** Slow — `duration={20}` halves the rotation speed. */
export const Slow: Story = {
  args: { duration: 20 },
  render: (args) => (
    <Stage>
      <Frame>
        <SpinningText {...args}>Slow steady • Indiecrafts • </SpinningText>
      </Frame>
    </Stage>
  ),
};

/** Wider radius — `radius={9}` pushes letters further from the centre. */
export const WideRadius: Story = {
  args: { radius: 9 },
  render: (args) => (
    <Stage>
      <div className="relative flex h-72 w-72 items-center justify-center text-sm font-medium">
        <SpinningText {...args}>Indiecrafts • Studio • Build • </SpinningText>
      </div>
    </Stage>
  ),
};

/** With centre content — wraps a label/icon at the centre of the spin. */
export const WithCenter: Story = {
  render: () => (
    <Stage>
      <div className="relative flex h-56 w-56 items-center justify-center text-sm font-medium">
        <SpinningText>Build • Ship • Iterate • </SpinningText>
        <span className="bg-primary text-primary-foreground absolute flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
          IC
        </span>
      </div>
    </Stage>
  ),
};
