import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VerticalCutReveal } from "./index";

const meta: Meta<typeof VerticalCutReveal> = {
  title: "UI Effects/Text/VerticalCutReveal",
  component: VerticalCutReveal,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof VerticalCutReveal>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-screen w-full flex-col items-start justify-center bg-white p-10 text-2xl tracking-wide text-[#0015ff] uppercase sm:text-4xl md:p-16 md:text-5xl lg:p-24">
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="first"
        transition={{ type: "spring", stiffness: 200, damping: 21 }}
      >
        {"HI 👋, FRIEND!"}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="last"
        reverse
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 0.5,
        }}
      >
        {"🌤️ IT IS NICE ⇗ TO"}
      </VerticalCutReveal>
      <VerticalCutReveal
        splitBy="characters"
        staggerDuration={0.025}
        staggerFrom="center"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 21,
          delay: 1.1,
        }}
      >
        {"MEET 😊 YOU."}
      </VerticalCutReveal>
    </div>
  ),
};
