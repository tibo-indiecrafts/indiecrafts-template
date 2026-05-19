import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VideoMasking } from "./index";

const meta: Meta<typeof VideoMasking> = {
  title: "UI Effects/Masking/VideoMasking",
  component: VideoMasking,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof VideoMasking>;

export const Default: Story = {
  render: () => (
    <div className="w-[min(90vw,720px)]">
      <VideoMasking />
    </div>
  ),
};

export const CustomSource: Story = {
  render: () => (
    <div className="w-[min(90vw,720px)]">
      <VideoMasking
        src="https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4"
        fallbackColor="oklch(0.55 0.18 260)"
      />
    </div>
  ),
};
