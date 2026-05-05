import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InfiniteSlider } from "./InfiniteSlider";

const meta: Meta<typeof InfiniteSlider> = {
  title: "UI Effects/Marquees & Scroll/InfiniteSlider",
  component: InfiniteSlider,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InfiniteSlider>;

export const Default: Story = {
  args: {
    speed: 60,
    speedOnHover: 20,
    children: ["One", "Two", "Three", "Four", "Five"].map((label) => (
      <span
        key={label}
        className="bg-card ring-border rounded-full px-4 py-2 text-sm shadow-sm ring-1"
      >
        {label}
      </span>
    )),
  },
};
