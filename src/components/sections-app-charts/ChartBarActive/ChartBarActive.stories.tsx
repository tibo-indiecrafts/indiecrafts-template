import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartBarActive } from "./index";

const meta: Meta<typeof ChartBarActive> = {
  title: "Sections/App/Charts/ChartBarActive",
  component: ChartBarActive,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartBarActive>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartBarActive />
      </div>
    </div>
  ),
};
