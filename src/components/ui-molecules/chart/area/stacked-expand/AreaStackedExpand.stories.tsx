import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaStackedExpand } from "./index";

const meta: Meta<typeof AreaStackedExpand> = {
  title: "UI Molecules/Chart/Area/StackedExpand",
  component: AreaStackedExpand,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaStackedExpand>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaStackedExpand />
      </div>
    </div>
  ),
};
