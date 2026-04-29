import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartBarHorizontal } from "./index";

const meta: Meta<typeof ChartBarHorizontal> = {
  title: "Sections/App/Charts/ChartBarHorizontal",
  component: ChartBarHorizontal,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartBarHorizontal>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartBarHorizontal />
      </div>
    </div>
  ),
};
