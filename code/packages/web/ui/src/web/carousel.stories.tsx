import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Carousel from "./carousel";
import docs from "./carousel.md?raw";

const meta = {
  title: "Web/UI/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const slides = [
  {
    title: "Mountain range",
    button: "Explore",
    src: "https://picsum.photos/id/1015/700/700",
  },
  {
    title: "Quiet forest",
    button: "Explore",
    src: "https://picsum.photos/id/1018/700/700",
  },
  {
    title: "Open coastline",
    button: "Explore",
    src: "https://picsum.photos/id/1019/700/700",
  },
  {
    title: "City at dusk",
    button: "Explore",
    src: "https://picsum.photos/id/1016/700/700",
  },
];

export const Default: Story = {
  render: () => (
    <div className="py-12">
      <Carousel slides={slides} />
    </div>
  ),
};
