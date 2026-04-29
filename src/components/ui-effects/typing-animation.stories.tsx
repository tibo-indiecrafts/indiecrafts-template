import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TypingAnimation } from "./typing-animation";

const meta: Meta<typeof TypingAnimation> = {
  title: "UI Effects/TypingAnimation",
  component: TypingAnimation,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 30, max: 300, step: 10 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    pauseDelay: { control: { type: "range", min: 200, max: 5000, step: 100 } },
    loop: { control: "boolean" },
    showCursor: { control: "boolean" },
    blinkCursor: { control: "boolean" },
    cursorStyle: {
      control: "inline-radio",
      options: ["line", "block", "underscore"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TypingAnimation>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background text-foreground flex min-h-[200px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — types a single string character-by-character with a blinking
 * cursor. The cursor disappears once the typing completes.
 */
export const Default: Story = {
  args: { duration: 100 },
  render: (args) => (
    <Stage>
      <TypingAnimation {...args} className="text-2xl font-semibold">
        Typing one character at a time…
      </TypingAnimation>
    </Stage>
  ),
};

/**
 * Looping words — pass `words` to cycle through phrases. Each is typed,
 * paused, deleted, then the next one is typed.
 */
export const LoopingWords: Story = {
  args: { duration: 80, pauseDelay: 1500, loop: true },
  render: (args) => (
    <Stage>
      <TypingAnimation
        {...args}
        words={["Build fast.", "Ship often.", "Repeat."]}
        className="text-2xl font-semibold"
      />
    </Stage>
  ),
};

/** Block cursor — `cursorStyle="block"` for a terminal feel. */
export const BlockCursor: Story = {
  args: { cursorStyle: "block" },
  render: (args) => (
    <Stage>
      <TypingAnimation
        {...args}
        className="font-mono text-2xl"
      >
        $ pnpm dev
      </TypingAnimation>
    </Stage>
  ),
};

/** Underscore cursor — `cursorStyle="underscore"`. */
export const UnderscoreCursor: Story = {
  args: { cursorStyle: "underscore" },
  render: (args) => (
    <Stage>
      <TypingAnimation
        {...args}
        className="font-mono text-2xl"
      >
        building...
      </TypingAnimation>
    </Stage>
  ),
};

/** Hero — `as="h1"` swaps the rendered tag and bumps the size via className. */
export const Hero: Story = {
  args: { duration: 80 },
  render: (args) => (
    <Stage>
      <TypingAnimation
        {...args}
        as="h1"
        className="text-5xl font-bold md:text-7xl"
      >
        Indiecrafts
      </TypingAnimation>
    </Stage>
  ),
};

/** With delay — `delay={1500}` waits 1.5s before typing begins. */
export const Delayed: Story = {
  args: { duration: 100, delay: 1500 },
  render: (args) => (
    <Stage>
      <TypingAnimation {...args} className="text-2xl font-semibold">
        Waited a moment, then typed this.
      </TypingAnimation>
    </Stage>
  ),
};
