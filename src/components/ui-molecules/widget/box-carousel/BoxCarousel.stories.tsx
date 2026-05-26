import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bug, BugOff } from "lucide-react";
import { useRef, useState } from "react";

import { useMedia } from "@/components/_hooks/use-media";

import { BoxCarousel, type BoxCarouselRef, type CarouselItem } from "./index";

const meta: Meta<typeof BoxCarousel> = {
  title: "UI Molecules/Widget/BoxCarousel",
  component: BoxCarousel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BoxCarousel>;

const ITEMS: CarouselItem[] = [
  {
    id: "1",
    type: "image",
    src: "https://cdn.cosmos.so/778d0640-d4b8-45b4-8bbe-862e759c231d?format=jpeg",
    alt: "Blurry poster",
  },
  {
    id: "2",
    type: "image",
    src: "https://cdn.cosmos.so/27ac2696-1f2b-498e-8d3d-11f2dd358ab9?format=jpeg",
    alt: "Abstract blurry figure",
  },
  {
    id: "3",
    type: "image",
    src: "https://cdn.cosmos.so/c48b739d-202d-4340-ab6b-afa34f0d7142?format=jpeg",
    alt: "Long exposure photo of a person",
  },
  {
    id: "4",
    type: "image",
    src: "https://cdn.cosmos.so/5332f9ac-7823-4635-871d-d4b3032e1c62?format=jpeg",
    alt: "Blurry portrait photo of a person",
  },
  {
    id: "5",
    type: "image",
    src: "https://cdn.cosmos.so/d9ed937e-7c3b-4f64-a4f3-708d639f13a1?format=jpeg",
    alt: "Long exposure shots with multiple people",
  },
  {
    id: "6",
    type: "image",
    src: "https://cdn.cosmos.so/33b43e2a-da66-42d9-a0b1-08165d80b0aa?format=jpeg",
    alt: "Close up blurry photo of a person",
  },
  {
    id: "7",
    type: "image",
    src: "https://cdn.cosmos.so/40342df7-2ea2-4297-add2-fe17cdc62551?format=jpeg",
    alt: "Long exposure shot of a motorcyclist",
  },
];

function Stage() {
  const carouselRef = useRef<BoxCarouselRef>(null);
  const [debug, setDebug] = useState(false);
  const isCompact = useMedia("(max-width: 768px)");

  const width = isCompact ? 200 : 350;
  const height = isCompact ? 150 : 250;

  return (
    <div className="text-muted-foreground relative flex h-dvh w-full items-center justify-center bg-[#fefefe] p-6">
      <button
        type="button"
        onClick={() => setDebug((d) => !d)}
        aria-label={debug ? "Disable debug mode" : "Enable debug mode"}
        className="absolute top-4 left-4 cursor-pointer rounded-full border border-black p-1.5 text-black transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95"
      >
        {debug ? <Bug size={12} /> : <BugOff size={12} />}
      </button>

      <div className="space-y-24">
        <div className="flex justify-center pt-20">
          <BoxCarousel
            ref={carouselRef}
            items={ITEMS}
            width={width}
            height={height}
            direction="right"
            debug={debug}
            enableDrag
            perspective={1000}
          />
        </div>

        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => carouselRef.current?.prev()}
            className="cursor-pointer rounded-full border border-black px-2 py-0.5 text-xs text-black transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => carouselRef.current?.next()}
            className="cursor-pointer rounded-full border border-black px-2 py-0.5 text-xs text-black transition-all duration-300 ease-out hover:bg-gray-100 active:scale-95"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
