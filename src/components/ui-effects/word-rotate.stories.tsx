import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WordRotate } from "./word-rotate";

const meta: Meta<typeof WordRotate> = {
  title: "UI Effects/Text/WordRotate",
  component: WordRotate,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 500, max: 6000, step: 250 } },
  },
};
export default meta;

type Story = StoryObj<typeof WordRotate>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background text-foreground flex min-h-[260px] w-full items-center justify-center p-10">
    {children}
  </div>
);

export const Default: Story = {
  args: {
    words: ["fast", "reliable", "modern", "accessible"],
    duration: 2500,
  },
  render: (args) => (
    <Stage>
      <WordRotate {...args} className="text-5xl font-bold" />
    </Stage>
  ),
};

export const Slow: Story = {
  args: { words: ["Build", "Ship", "Iterate"], duration: 4000 },
  render: (args) => (
    <Stage>
      <WordRotate {...args} className="text-4xl font-bold" />
    </Stage>
  ),
};

export const Hero: Story = {
  args: {
    words: ["beautiful", "modern", "fast", "accessible"],
    duration: 2200,
  },
  render: (args) => (
    <Stage>
      <WordRotate {...args} className="text-7xl font-bold" />
    </Stage>
  ),
};

export const InlinePhrase: Story = {
  render: () => (
    <Stage>
      <div className="flex items-baseline gap-3 text-3xl font-semibold">
        <span>Built for</span>
        <WordRotate
          className="text-primary text-3xl font-semibold"
          words={["indies", "agencies", "studios"]}
        />
      </div>
    </Stage>
  ),
};

export const CustomMotion: Story = {
  render: () => (
    <Stage>
      <WordRotate
        className="text-5xl font-bold"
        words={["Slide", "Across", "Smoothly"]}
        motionProps={{
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 40 },
          transition: { duration: 0.35, ease: "easeOut" },
        }}
      />
    </Stage>
  ),
};
