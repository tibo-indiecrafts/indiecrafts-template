import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaInteractive } from "./index";

const meta: Meta<typeof ChartAreaInteractive> = {
  title: "Sections/App/Charts/ChartAreaInteractive",
  component: ChartAreaInteractive,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaInteractive>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl">
        <ChartAreaInteractive />
      </div>
    </div>
  ),
};
