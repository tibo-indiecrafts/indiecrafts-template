import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlipWords } from "./flip-words";

const meta: Meta<typeof FlipWords> = {
  title: "UI Effects/Text/FlipWords",
  component: FlipWords,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 500, max: 8000, step: 250 } },
  },
};
export default meta;

type Story = StoryObj<typeof FlipWords>;

export const Default: Story = {
  render: () => (
    <div className="text-foreground text-3xl font-medium">
      Build something
      <FlipWords words={["beautiful", "modern", "fast", "accessible"]} />
      with this template.
    </div>
  ),
};

export const Slow: Story = {
  render: () => (
    <div className="text-foreground text-3xl font-medium">
      Ship a
      <FlipWords words={["startup", "portfolio", "blog", "store"]} duration={4500} />
      in a single weekend.
    </div>
  ),
};

export const Fast: Story = {
  render: () => (
    <div className="text-foreground text-3xl font-medium">
      Make it
      <FlipWords words={["snappy", "instant", "rapid"]} duration={1000} />
      every time.
    </div>
  ),
};

export const Hero: Story = {
  render: () => (
    <h1 className="text-foreground max-w-3xl text-5xl font-bold md:text-6xl">
      Build
      <FlipWords
        words={["faster", "leaner", "smarter", "cheaper"]}
        className="text-primary text-5xl md:text-6xl"
      />
      than you ever have before.
    </h1>
  ),
};

export const LongPhrases: Story = {
  render: () => (
    <div className="text-foreground max-w-2xl text-2xl font-medium">
      Ideal for
      <FlipWords
        words={[
          "indie hackers shipping fast",
          "agencies running 30 client sites",
          "design teams who care about details",
        ]}
        duration={4000}
      />
      .
    </div>
  ),
};
