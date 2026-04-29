import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaLinear } from "./index";

const meta: Meta<typeof ChartAreaLinear> = {
  title: "Sections/App/Charts/ChartAreaLinear",
  component: ChartAreaLinear,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaLinear>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartAreaLinear />
      </div>
    </div>
  ),
};
