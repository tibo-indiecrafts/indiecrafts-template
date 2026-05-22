import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useMedia } from "@/hooks/use-media";

import { DragElements } from "./index";

const meta: Meta<typeof DragElements> = {
  title: "UI Effects/Hover & Interactions/DragElements",
  component: DragElements,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DragElements>;

const URLS = [
  "https://images.unsplash.com/photo-1683746531526-3bca2bc901b8?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631561729243-9b3291efceae?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635434002329-8ab192fe01e1?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1719586799413-3f42bb2a132d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1720561467986-ca3d408ca30b?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1724403124996-64115f38cd3f?q=80&w=400&auto=format&fit=crop",
];

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Polaroid sizing/rotation seeds frozen at module load so re-renders don't
// reshuffle the photos under the user's cursor.
const isCompactDefault = false;
const SEEDS = URLS.map(() => ({
  rotation: randomInt(-12, 12),
  compact: {
    width: randomInt(90, 120),
    height: randomInt(120, 140),
  },
  full: {
    width: randomInt(120, 150),
    height: randomInt(150, 180),
  },
  initial: isCompactDefault,
}));

function Polaroids() {
  const isCompact = useMedia("(max-width: 767px)");
  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-[#eeeeee]">
      <h1 className="text-muted-foreground absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-xl uppercase md:ml-36 md:text-4xl">
        all your{" "}
        <span className="text-foreground dark:text-muted font-bold">memories.</span>
      </h1>
      <DragElements dragMomentum={false} className="p-40">
        {URLS.map((url, index) => {
          const seed = SEEDS[index];
          const { width, height } = isCompact ? seed.compact : seed.full;
          return (
            <div
              key={url}
              className="flex items-start justify-center bg-white p-4 shadow-2xl"
              style={{
                transform: `rotate(${seed.rotation}deg)`,
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: `${width - 4}px`,
                  height: `${height - 30}px`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- demo uses external Unsplash URLs; next/image would need remote-pattern config */}
                <img
                  src={url}
                  alt={`Memory ${index + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </DragElements>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Polaroids />,
};
