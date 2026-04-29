import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaStep } from "./index";

const meta: Meta<typeof ChartAreaStep> = {
  title: "Sections/App/Charts/ChartAreaStep",
  component: ChartAreaStep,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaStep>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartAreaStep />
      </div>
    </div>
  ),
};
