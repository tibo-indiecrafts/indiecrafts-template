import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaLinear } from "./index";

const meta: Meta<typeof AreaLinear> = {
  title: "UI Molecules/Chart/Area/Linear",
  component: AreaLinear,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaLinear>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaLinear />
      </div>
    </div>
  ),
};
