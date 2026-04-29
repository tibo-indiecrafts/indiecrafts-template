import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaDefault } from "./index";

const meta: Meta<typeof ChartAreaDefault> = {
  title: "Sections/App/Charts/ChartAreaDefault",
  component: ChartAreaDefault,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaDefault>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartAreaDefault />
      </div>
    </div>
  ),
};
