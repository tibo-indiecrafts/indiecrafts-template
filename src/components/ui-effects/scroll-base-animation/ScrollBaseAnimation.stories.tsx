import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScrollBaseAnimation } from "./index";

const meta: Meta<typeof ScrollBaseAnimation> = {
  title: "UI Effects/Marquees & Scroll/ScrollBaseAnimation",
  component: ScrollBaseAnimation,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrollBaseAnimation>;

const HEADING = "font-bold tracking-[-0.07em] leading-[90%]";

export const TwoLines: Story = {
  render: () => (
    <div className="grid h-[500px] place-content-center">
      <ScrollBaseAnimation delay={500} baseVelocity={-3} className={HEADING}>
        Star the repo if you like it
      </ScrollBaseAnimation>
      <ScrollBaseAnimation delay={500} baseVelocity={3} className={HEADING}>
        Share it if you like it
      </ScrollBaseAnimation>
    </div>
  ),
};

export const ScrollAware: Story = {
  render: () => (
    <div className="h-[200vh]">
      <div className="sticky top-1/2 -translate-y-1/2">
        <ScrollBaseAnimation baseVelocity={3} scrollDependent className={HEADING}>
          Best Component library For Developer
        </ScrollBaseAnimation>
      </div>
    </div>
  ),
};
