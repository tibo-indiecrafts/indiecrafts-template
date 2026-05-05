import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarInteractive } from "./index";

const meta: Meta<typeof BarInteractive> = {
  title: "UI Molecules/Chart/Bar/Interactive",
  component: BarInteractive,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BarInteractive>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl">
        <BarInteractive />
      </div>
    </div>
  ),
};
