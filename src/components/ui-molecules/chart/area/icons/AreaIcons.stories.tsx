import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaIcons } from "./index";

const meta: Meta<typeof AreaIcons> = {
  title: "UI Molecules/Chart/Area/Icons",
  component: AreaIcons,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaIcons>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaIcons />
      </div>
    </div>
  ),
};
