import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedMedia } from "./FeaturedMedia";
import docs from "./FeaturedMedia.md?raw";

// Client component: renders a cover image, or an inline-playable video facade
// when `videoUrl` is set (no modal — plays in place).
const meta = {
  title: "Web/UI Components/FeaturedMedia",
  component: FeaturedMedia,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: docs } },
  },
  args: {
    image: "https://picsum.photos/seed/cover/1280/720",
    alt: "Cover",
    playLabel: "Play video",
    aspect: "aspect-video",
    sizes: "100vw",
  },
} satisfies Meta<typeof FeaturedMedia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {};
export const Video: Story = {
  args: { videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
};
