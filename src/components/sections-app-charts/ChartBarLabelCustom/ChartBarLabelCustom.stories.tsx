import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartBarLabelCustom } from "./index";

const meta: Meta<typeof ChartBarLabelCustom> = {
  title: "Sections/App/Charts/ChartBarLabelCustom",
  component: ChartBarLabelCustom,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartBarLabelCustom>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartBarLabelCustom />
      </div>
    </div>
  ),
};
