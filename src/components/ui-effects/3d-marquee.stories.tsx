import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThreeDMarquee } from "./3d-marquee";

const meta: Meta<typeof ThreeDMarquee> = {
  title: "UI Effects/3dMarquee",
  component: ThreeDMarquee,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ThreeDMarquee>;

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=600&q=80",
  "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?w=600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  "https://images.unsplash.com/photo-1490604001847-b712b0c2f967?w=600&q=80",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&q=80",
  "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=600&q=80",
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80",
  "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=600&q=80",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80",
  "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=600&q=80",
];

const DENSE_IMAGES = [...SAMPLE_IMAGES, ...SAMPLE_IMAGES.slice(0, 8)];

/**
 * The marquee was designed to sit BEHIND content as a hero backdrop —
 * absolute positioning + a viewport-tall container is the configuration
 * that exposes the rotated 1720×1720 grid properly. Each story below uses
 * that pattern; only the framing differs.
 *
 * Stories also need ≥16 images. With fewer, each column has too few tiles
 * and the `motion.div`'s `y: ±100` animation pushes them off-screen.
 */

/** Hero pattern — full-viewport marquee with a dark veil and centered headline. */
export const Default: Story = {
  render: () => (
    <div className="relative mx-auto flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <div className="absolute inset-0 z-0">
        <ThreeDMarquee className="h-full" images={SAMPLE_IMAGES} />
      </div>
      <div className="absolute inset-0 z-10 bg-black/60 dark:bg-black/40" />
      <div className="relative z-20 px-6 text-center">
        <h2 className="text-4xl font-semibold text-white md:text-6xl">
          A whole new way to ship.
        </h2>
        <p className="mt-3 text-white/70">
          Marketing copy reads cleanly thanks to the dark gradient overlay.
        </p>
      </div>
    </div>
  ),
};

/** Dense — 24 images, fuller scrolling wall, lighter veil. */
export const Dense: Story = {
  render: () => (
    <div className="relative mx-auto flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <div className="absolute inset-0 z-0">
        <ThreeDMarquee className="h-full" images={DENSE_IMAGES} />
      </div>
      <div className="absolute inset-0 z-10 bg-black/30 dark:bg-black/20" />
      <div className="relative z-20 px-6 text-center">
        <h2 className="text-3xl font-semibold text-white md:text-5xl">
          Twenty-four tiles, four streaming columns.
        </h2>
      </div>
    </div>
  ),
};
