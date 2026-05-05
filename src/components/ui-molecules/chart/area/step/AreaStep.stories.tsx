import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaStep } from "./index";

const meta: Meta<typeof AreaStep> = {
  title: "UI Molecules/Chart/Area/Step",
  component: AreaStep,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaStep>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaStep />
      </div>
    </div>
  ),
};
