import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartBarInteractive } from "./index";

const meta: Meta<typeof ChartBarInteractive> = {
  title: "Sections/App/Charts/ChartBarInteractive",
  component: ChartBarInteractive,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartBarInteractive>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl">
        <ChartBarInteractive />
      </div>
    </div>
  ),
};
