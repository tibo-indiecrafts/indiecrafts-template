import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnimatedList } from "./index";

const meta: Meta<typeof AnimatedList> = {
  title: "UI Molecules/Widget/AnimatedList",
  component: AnimatedList,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AnimatedList>;

const ITEMS = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
];

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-white">
      <AnimatedList
        items={ITEMS}
        onItemSelect={(item, index) => console.log(item, index)}
        showGradients
        enableArrowNavigation
        displayScrollbar
      />
    </div>
  ),
};
