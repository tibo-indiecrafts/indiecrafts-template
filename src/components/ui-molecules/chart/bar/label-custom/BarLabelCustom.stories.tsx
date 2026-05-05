import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarLabelCustom } from "./index";

const meta: Meta<typeof BarLabelCustom> = {
  title: "UI Molecules/Chart/Bar/LabelCustom",
  component: BarLabelCustom,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BarLabelCustom>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <BarLabelCustom />
      </div>
    </div>
  ),
};
