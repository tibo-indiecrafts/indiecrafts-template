import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";

import { BlurVignette, BlurVignetteArticle } from "./index";

const meta: Meta<typeof BlurVignette> = {
  title: "UI Effects/Cards/BlurVignette",
  component: BlurVignette,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BlurVignette>;

export const ImageVignette: Story = {
  render: () => (
    <BlurVignette
      radius="24px"
      inset="10px"
      transitionLength="100px"
      blur="15px"
      className="h-96 w-[420px]"
    >
      <Image
        src="https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format"
        alt=""
        fill
        sizes="420px"
        className="object-cover transition-transform duration-500 hover:scale-110"
      />
      <BlurVignetteArticle />
    </BlurVignette>
  ),
};

export const VideoVignette: Story = {
  render: () => (
    <BlurVignette
      radius="24px"
      inset="10px"
      transitionLength="100px"
      blur="15px"
      className="h-96 w-[420px]"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
      >
        <source
          src="https://cdn.pixabay.com/video/2023/10/19/185726-876210695_large.mp4"
          type="video/mp4"
        />
        <track kind="captions" />
      </video>
      <BlurVignetteArticle />
    </BlurVignette>
  ),
};
