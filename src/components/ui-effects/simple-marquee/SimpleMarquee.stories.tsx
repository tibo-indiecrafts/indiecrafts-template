import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef } from "react";

import { SimpleMarquee } from "./index";

const meta: Meta<typeof SimpleMarquee> = {
  title: "UI Effects/Marquees & Scroll/SimpleMarquee",
  component: SimpleMarquee,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SimpleMarquee>;

const IMAGES = [
  "https://cdn.cosmos.so/4b771c5c-d1eb-4948-b839-255dbeb931ba?format=jpeg",
  "https://cdn.cosmos.so/a8d82afd-2293-43ad-bac3-887683d85b44?format=jpeg",
  "https://cdn.cosmos.so/49206ba5-c174-4cd5-aee8-5b744842e6c2?format=jpeg",
  "https://cdn.cosmos.so/b29bd150-6477-420f-8efb-65ed99694421?format=jpeg",
  "https://cdn.cosmos.so/e1a0313e-7617-431d-b7f1-f1b169e6bcb4?format=jpeg",
  "https://cdn.cosmos.so/ad640c12-69fb-4186-bc3d-b1cc93986a37?format=jpeg",
  "https://cdn.cosmos.so/5cf0c3d2-e785-41a3-b0c8-a073ee2f2862?format=jpeg",
  "https://cdn.cosmos.so/938ab21c-a975-41b3-b303-418290343b09?format=jpeg",
  "https://cdn.cosmos.so/2e14a9bb-27e3-40fd-b940-cfb797a1224c?format=jpeg",
  "https://cdn.cosmos.so/81841d9f-e164-4770-aebc-cfc97d72f3ab?format=jpeg",
  "https://cdn.cosmos.so/49b81db0-37ea-4569-b0d6-04afa5115a10?format=jpeg",
  "https://cdn.cosmos.so/ade1834b-9317-44fb-8dc3-b43d29acd409?format=jpeg",
  "https://cdn.cosmos.so/621c250c-3833-45f9-862a-3f400aaf8f28?format=jpeg",
  "https://cdn.cosmos.so/f9b7eae8-e5a6-4ce6-b6e1-9ef125ba7f8e?format=jpeg",
  "https://cdn.cosmos.so/bd56ed6d-1bbd-44a4-b1a1-79b7199bbebb?format=jpeg",
];

function MarqueeItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-2 cursor-pointer duration-300 ease-in-out hover:scale-105 sm:mx-3 md:mx-4">
      {children}
    </div>
  );
}

function WeeklyFinds() {
  const container = useRef<HTMLDivElement>(null);
  const firstThird = IMAGES.slice(0, Math.floor(IMAGES.length / 3));
  const secondThird = IMAGES.slice(
    Math.floor(IMAGES.length / 3),
    Math.floor((2 * IMAGES.length) / 3),
  );
  const lastThird = IMAGES.slice(Math.floor((2 * IMAGES.length) / 3));

  return (
    <div
      ref={container}
      className="relative flex h-dvh w-dvw flex-col items-center justify-center overflow-auto bg-black"
    >
      <h1 className="absolute top-1/3 text-center text-3xl text-white sm:top-1/3 sm:text-5xl md:top-1/4 md:text-6xl">
        Weekly Finds
      </h1>
      <div className="absolute top-0 flex h-[170%] w-full flex-col items-center justify-center space-y-2 sm:h-[200%] sm:space-y-3 md:space-y-4">
        {[firstThird, secondThird, lastThird].map((row, rowIndex) => (
          <SimpleMarquee
            key={rowIndex}
            className="w-full"
            baseVelocity={8}
            repeat={4}
            draggable={false}
            scrollSpringConfig={{ damping: 50, stiffness: 400 }}
            slowDownFactor={0.1}
            slowdownOnHover
            slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
            scrollAwareDirection
            scrollContainer={container}
            useScrollVelocity
            direction={rowIndex === 1 ? "right" : "left"}
          >
            {row.map((src, i) => (
              <MarqueeItem key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element -- external Cosmos URLs */}
                <img
                  src={src}
                  alt={`Find ${rowIndex * 5 + i + 1}`}
                  className="h-20 w-32 object-cover sm:h-24 sm:w-40 md:h-32 md:w-48"
                />
              </MarqueeItem>
            ))}
          </SimpleMarquee>
        ))}
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <WeeklyFinds />,
};
