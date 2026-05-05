import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaDefault } from "./index";

const meta: Meta<typeof AreaDefault> = {
  title: "UI Molecules/Chart/Area/Default",
  component: AreaDefault,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaDefault>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaDefault />
      </div>
    </div>
  ),
};
