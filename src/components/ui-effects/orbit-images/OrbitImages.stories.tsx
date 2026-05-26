import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OrbitImages } from "./index";

const meta: Meta<typeof OrbitImages> = {
  title: "UI Effects/Animations/OrbitImages",
  component: OrbitImages,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof OrbitImages>;

const IMAGES = [
  "https://picsum.photos/300/300?grayscale&random=1",
  "https://picsum.photos/300/300?grayscale&random=2",
  "https://picsum.photos/300/300?grayscale&random=3",
  "https://picsum.photos/300/300?grayscale&random=4",
  "https://picsum.photos/300/300?grayscale&random=5",
  "https://picsum.photos/300/300?grayscale&random=6",
];

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-neutral-100 p-8">
      <div className="w-full max-w-5xl">
        <OrbitImages
          images={IMAGES}
          shape="ellipse"
          radiusX={340}
          radiusY={80}
          rotation={-8}
          duration={30}
          itemSize={80}
          responsive
          radius={160}
          direction="normal"
          fill
          showPath
          paused={false}
        />
      </div>
    </div>
  ),
};

export const Star: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-neutral-100 p-8">
      <div className="w-full max-w-4xl">
        <OrbitImages
          images={IMAGES}
          shape="star"
          radius={400}
          starPoints={5}
          starInnerRatio={0.5}
          rotation={0}
          duration={40}
          itemSize={72}
          responsive
          fill
          showPath
        />
      </div>
    </div>
  ),
};

export const Infinity: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-neutral-100 p-8">
      <div className="w-full max-w-5xl">
        <OrbitImages
          images={IMAGES}
          shape="infinity"
          radiusX={340}
          radiusY={160}
          rotation={0}
          duration={25}
          itemSize={70}
          responsive
          fill
          showPath
          pathColor="rgba(82, 39, 255, 0.3)"
        />
      </div>
    </div>
  ),
};
