import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Typewriter } from "./index";

const meta: Meta<typeof Typewriter> = {
  title: "UI Effects/Text/Typewriter",
  component: Typewriter,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Typewriter>;

export const Showcase: Story = {
  render: () => (
    <div className="text-foreground dark:text-muted flex h-dvh w-dvw flex-row items-start justify-start overflow-hidden bg-white p-16 pt-48 text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl">
      <p className="whitespace-pre-wrap">
        <span>{"We're born 🌞 to "}</span>
        <Typewriter
          text={[
            "experience",
            "dance",
            "love",
            "be alive",
            "create things that make the world a better place",
          ]}
          speed={70}
          className="text-pretty text-yellow-500"
          waitTime={1500}
          deleteSpeed={40}
          cursorChar="_"
        />
      </p>
    </div>
  ),
};
