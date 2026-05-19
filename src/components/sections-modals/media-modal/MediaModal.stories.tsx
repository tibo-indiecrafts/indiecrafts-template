import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { mediaModalSample } from "./config";
import { MediaModalSection } from "./index";

const meta: Meta<typeof MediaModalSection> = {
  title: "Sections/Modals/MediaModal",
  component: MediaModalSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MediaModalSection>;

export const Image: Story = {
  args: {
    ...mediaModalSample,
    id: "story-media-modal-image",
  } as React.ComponentProps<typeof MediaModalSection>,
};

export const Video: Story = {
  args: {
    ...mediaModalSample,
    imgSrc: undefined,
    videoSrc:
      "https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4",
    id: "story-media-modal-video",
  } as React.ComponentProps<typeof MediaModalSection>,
};
