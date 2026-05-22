import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useMedia } from "@/hooks/use-media";

import { CirclingElements } from "./index";

const meta: Meta<typeof CirclingElements> = {
  title: "UI Effects/Hover & Interactions/CirclingElements",
  component: CirclingElements,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CirclingElements>;

// Inline image set replaces the upstream demo's `@/utils/demo-images` import.
const IMAGES = [
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=200&auto=format&fit=crop",
];

function Stage() {
  const isCompact = useMedia("(max-width: 767px)");
  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-[#efefef]">
      <CirclingElements
        radius={isCompact ? 80 : 120}
        duration={10}
        easing="linear"
        pauseOnHover
      >
        {IMAGES.map((url, index) => (
          <div
            key={url}
            className="h-20 w-20 cursor-pointer duration-200 ease-out hover:scale-125 md:h-28 md:w-28"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- external Unsplash URLs */}
            <img
              src={url}
              alt={`Orbiting tile ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </CirclingElements>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
