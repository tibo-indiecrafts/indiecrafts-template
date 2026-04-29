import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartBarDefault } from "./index";

const meta: Meta<typeof ChartBarDefault> = {
  title: "Sections/App/Charts/ChartBarDefault",
  component: ChartBarDefault,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartBarDefault>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartBarDefault />
      </div>
    </div>
  ),
};
