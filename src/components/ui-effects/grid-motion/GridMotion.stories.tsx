import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GridMotion } from "./index";

const meta: Meta<typeof GridMotion> = {
  title: "UI Effects/Backgrounds/GridMotion",
  component: GridMotion,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GridMotion>;

const IMAGE =
  "https://images.unsplash.com/photo-1748370987492-eb390a61dcda?q=80&w=1600&auto=format&fit=crop";

const sameImageItems = Array.from({ length: 30 }, () => IMAGE);

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <GridMotion items={sameImageItems} gradientColor="black" />
    </div>
  ),
};

const mixedItems: (string | React.ReactNode)[] = [
  "Item 1",
  <div key="jsx-1">Custom JSX</div>,
  IMAGE,
  "Item 2",
  <div key="jsx-2">Custom JSX</div>,
  "Item 4",
  <div key="jsx-3">Custom JSX</div>,
  IMAGE,
  "Item 5",
  <div key="jsx-4">Custom JSX</div>,
  "Item 7",
  <div key="jsx-5">Custom JSX</div>,
  IMAGE,
  "Item 8",
  <div key="jsx-6">Custom JSX</div>,
  "Item 10",
  <div key="jsx-7">Custom JSX</div>,
  IMAGE,
  "Item 11",
  <div key="jsx-8">Custom JSX</div>,
  "Item 13",
  <div key="jsx-9">Custom JSX</div>,
  IMAGE,
  "Item 14",
  <div key="jsx-10">Custom JSX</div>,
  "Item 16",
  <div key="jsx-11">Custom JSX</div>,
  IMAGE,
  "Item 17",
];

export const Mixed: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <GridMotion items={mixedItems} gradientColor="black" />
    </div>
  ),
};
