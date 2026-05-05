import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarDefault } from "./index";

const meta: Meta<typeof BarDefault> = {
  title: "UI Molecules/Chart/Bar/Default",
  component: BarDefault,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BarDefault>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <BarDefault />
      </div>
    </div>
  ),
};
