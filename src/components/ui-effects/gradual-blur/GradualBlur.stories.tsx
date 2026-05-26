import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GradualBlur } from "./index";

const meta: Meta<typeof GradualBlur> = {
  title: "UI Effects/Animations/GradualBlur",
  component: GradualBlur,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GradualBlur>;

const LOREM = Array.from({ length: 12 }, (_, i) => (
  <p key={i} className="mb-6 text-lg leading-relaxed text-white/80">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Paragraph{" "}
    {i + 1}.
  </p>
));

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black p-8">
      <section className="relative h-[500px] w-full max-w-3xl overflow-hidden rounded-xl bg-neutral-900">
        <div className="h-full overflow-y-auto px-8 py-24">{LOREM}</div>
        <GradualBlur
          target="parent"
          position="bottom"
          height="7rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
        />
      </section>
    </div>
  ),
};

export const TopAndBottom: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black p-8">
      <section className="relative h-[600px] w-full max-w-3xl overflow-hidden rounded-xl bg-neutral-900">
        <div className="h-full overflow-y-auto px-8 py-32">{LOREM}</div>
        <GradualBlur preset="header" />
        <GradualBlur preset="footer" />
      </section>
    </div>
  ),
};
