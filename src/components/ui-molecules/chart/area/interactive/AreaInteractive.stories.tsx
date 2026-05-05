import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaInteractive } from "./index";

const meta: Meta<typeof AreaInteractive> = {
  title: "UI Molecules/Chart/Area/Interactive",
  component: AreaInteractive,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaInteractive>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-5xl">
        <AreaInteractive />
      </div>
    </div>
  ),
};
