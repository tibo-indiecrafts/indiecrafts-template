import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackgroundLines } from "./background-lines";

const meta: Meta<typeof BackgroundLines> = {
  title: "UI Effects/Backgrounds/BackgroundLines",
  component: BackgroundLines,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BackgroundLines>;

export const Default: Story = {
  render: () => (
    <BackgroundLines>
      <div className="relative z-10 flex h-screen items-center justify-center px-6">
        <div className="text-center">
          <h2 className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-4xl font-bold text-transparent md:text-7xl dark:from-white dark:via-neutral-200 dark:to-white">
            Lights, animated.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-sm">
            Soft moving lines behind a clean headline — perfect for a quiet hero.
          </p>
        </div>
      </div>
    </BackgroundLines>
  ),
};

export const SlowLines: Story = {
  render: () => (
    <BackgroundLines svgOptions={{ duration: 20 }}>
      <div className="relative z-10 flex h-screen items-center justify-center px-6">
        <h2 className="text-4xl font-bold md:text-6xl">Slow (20s cycle)</h2>
      </div>
    </BackgroundLines>
  ),
};

export const FastLines: Story = {
  render: () => (
    <BackgroundLines svgOptions={{ duration: 3 }}>
      <div className="relative z-10 flex h-screen items-center justify-center px-6">
        <h2 className="text-4xl font-bold md:text-6xl">Fast (3s cycle)</h2>
      </div>
    </BackgroundLines>
  ),
};

export const ShortStage: Story = {
  render: () => (
    <BackgroundLines className="h-[40vh]">
      <div className="relative z-10 flex h-[40vh] items-center justify-center px-6">
        <h3 className="text-3xl font-semibold">Section accent (40vh)</h3>
      </div>
    </BackgroundLines>
  ),
};
