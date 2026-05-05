import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaGradient } from "./index";

const meta: Meta<typeof AreaGradient> = {
  title: "UI Molecules/Chart/Area/Gradient",
  component: AreaGradient,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaGradient>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaGradient />
      </div>
    </div>
  ),
};
