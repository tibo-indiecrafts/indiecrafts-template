import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { useMedia } from "@/components/_hooks/use-media";

import { MediaBetweenText } from "./index";

const meta: Meta<typeof MediaBetweenText> = {
  title: "UI Effects/Hover & Interactions/MediaBetweenText",
  component: MediaBetweenText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MediaBetweenText>;

function Stage() {
  const isCompact = useMedia("(max-width: 639px)");
  return (
    <div className="bg-background flex h-dvh w-dvw flex-col items-center justify-center">
      <a
        href="https://www.instagram.com/p/C3oL4euoc2l/?img_index=1"
        target="_blank"
        rel="noreferrer"
      >
        <MediaBetweenText
          firstText="that's a nice ("
          secondText=") chair!"
          mediaUrl="https://cdn.cosmos.so/90e2192e-7bd4-44af-96ae-05cd955c0cfb?format=jpeg"
          mediaType="image"
          triggerType="hover"
          mediaContainerClassName="w-full h-[30px] sm:h-[100px] overflow-hidden mx-px mt-1 sm:mx-2 sm:mt-4"
          className="flex w-full cursor-pointer flex-row items-center justify-center text-2xl font-light text-[#ff5941] lowercase sm:text-6xl"
          animationVariants={{
            initial: { width: 0 },
            animate: {
              width: isCompact ? "30px" : "100px",
              transition: { duration: 0.4, type: "spring", bounce: 0 },
            },
          }}
        />
      </a>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
