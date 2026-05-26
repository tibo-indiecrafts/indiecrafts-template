import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useMedia } from "@/components/_hooks/use-media";

import { PixelTrail } from "./index";

const meta: Meta<typeof PixelTrail> = {
  title: "UI Effects/Hover & Interactions/PixelTrail",
  component: PixelTrail,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PixelTrail>;

function Stage() {
  const isCompact = useMedia("(max-width: 767px)");
  return (
    <div className="flex h-dvh w-dvw flex-col bg-black text-white">
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={isCompact ? 16 : 24}
          fadeDuration={500}
          pixelClassName="bg-white"
        />
      </div>
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-center">
        <h2 className="text-3xl uppercase sm:text-4xl md:text-6xl">
          FANCYCOMPONENTS.DEV
        </h2>
        <p className="pt-0.5 text-xs sm:pt-2 sm:text-base md:text-xl">
          Make the web fun again.
        </p>
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
