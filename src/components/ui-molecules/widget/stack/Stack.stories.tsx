import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Stack } from "./index";

const meta: Meta<typeof Stack> = {
  title: "UI Molecules/Widget/Stack",
  component: Stack,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stack>;

const IMAGES = [
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format",
];

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-white">
      <div style={{ width: 208, height: 208 }}>
        <Stack
          randomRotation={false}
          sensitivity={200}
          sendToBackOnClick
          cards={IMAGES.map((src, i) => (
            /* eslint-disable-next-line @next/next/no-img-element -- decorative card images; Stack sizes them via 100% width/height */
            <img
              key={i}
              src={src}
              alt={`card-${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ))}
          autoplay={false}
          autoplayDelay={3000}
          pauseOnHover={false}
        />
      </div>
    </div>
  ),
};
