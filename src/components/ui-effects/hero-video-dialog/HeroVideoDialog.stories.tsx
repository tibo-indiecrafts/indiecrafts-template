import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroVideoDialog } from "./index";

const meta: Meta<typeof HeroVideoDialog> = {
  title: "UI Effects/Modals & Overlays/HeroVideoDialog",
  component: HeroVideoDialog,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof HeroVideoDialog>;

const videoSrc = "https://www.youtube.com/embed/dQw4w9WgXcQ";
const thumbnailSrc =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[640px] max-w-full">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <HeroVideoDialog videoSrc={videoSrc} thumbnailSrc={thumbnailSrc} />
    </Frame>
  ),
};

export const FromTop: Story = {
  render: () => (
    <Frame>
      <HeroVideoDialog
        animationStyle="from-top"
        videoSrc={videoSrc}
        thumbnailSrc={thumbnailSrc}
      />
    </Frame>
  ),
};

export const FromBottom: Story = {
  render: () => (
    <Frame>
      <HeroVideoDialog
        animationStyle="from-bottom"
        videoSrc={videoSrc}
        thumbnailSrc={thumbnailSrc}
      />
    </Frame>
  ),
};

export const Fade: Story = {
  render: () => (
    <Frame>
      <HeroVideoDialog
        animationStyle="fade"
        videoSrc={videoSrc}
        thumbnailSrc={thumbnailSrc}
      />
    </Frame>
  ),
};
