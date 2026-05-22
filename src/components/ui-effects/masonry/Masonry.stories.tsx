import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Masonry, type MasonryItem } from "./index";

const meta: Meta<typeof Masonry> = {
  title: "UI Effects/Gallery/Masonry",
  component: Masonry,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Masonry>;

const ITEMS: MasonryItem[] = [
  {
    id: "1",
    img: "https://picsum.photos/id/1015/600/900?grayscale",
    url: "https://example.com/one",
    height: 400,
  },
  {
    id: "2",
    img: "https://picsum.photos/id/1011/600/750?grayscale",
    url: "https://example.com/two",
    height: 250,
  },
  {
    id: "3",
    img: "https://picsum.photos/id/1020/600/800?grayscale",
    url: "https://example.com/three",
    height: 600,
  },
  {
    id: "4",
    img: "https://picsum.photos/id/1024/600/700?grayscale",
    url: "https://example.com/four",
    height: 350,
  },
  {
    id: "5",
    img: "https://picsum.photos/id/1035/600/900?grayscale",
    url: "https://example.com/five",
    height: 500,
  },
  {
    id: "6",
    img: "https://picsum.photos/id/1043/600/600?grayscale",
    url: "https://example.com/six",
    height: 300,
  },
  {
    id: "7",
    img: "https://picsum.photos/id/1050/600/800?grayscale",
    url: "https://example.com/seven",
    height: 450,
  },
  {
    id: "8",
    img: "https://picsum.photos/id/1062/600/750?grayscale",
    url: "https://example.com/eight",
    height: 380,
  },
  {
    id: "9",
    img: "https://picsum.photos/id/1074/600/900?grayscale",
    url: "https://example.com/nine",
    height: 520,
  },
  {
    id: "10",
    img: "https://picsum.photos/id/1080/600/700?grayscale",
    url: "https://example.com/ten",
    height: 340,
  },
];

export const Showcase: Story = {
  render: () => (
    <div className="box-border w-full overflow-x-hidden bg-black p-8">
      <Masonry
        items={ITEMS}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover
        hoverScale={0.95}
        blurToFocus
        colorShiftOnHover={false}
      />
    </div>
  ),
};

export const ColorShift: Story = {
  render: () => (
    <div className="box-border w-full overflow-x-hidden bg-black p-8">
      <Masonry
        items={ITEMS}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="random"
        scaleOnHover
        hoverScale={0.97}
        blurToFocus
        colorShiftOnHover
      />
    </div>
  ),
};
