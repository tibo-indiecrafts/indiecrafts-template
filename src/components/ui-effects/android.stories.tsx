import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Android } from "./android";

const meta: Meta<typeof Android> = {
  title: "UI Effects/3D & Devices/Android",
  component: Android,
  parameters: { layout: "fullscreen" },

  decorators: [
    (Story) => (
      <div className="m-[-1.5rem] flex min-h-svh items-start justify-center overflow-y-auto p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Android>;

const screenshotSrc =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80";
const videoSrc =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const Default: Story = {};

export const WithScreenshot: Story = {
  args: { src: screenshotSrc },
};

export const WithVideo: Story = {
  args: { videoSrc },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <div className="origin-top scale-50">
        <Android src={screenshotSrc} />
      </div>
      <div className="origin-top scale-75">
        <Android src={screenshotSrc} />
      </div>
      <div className="origin-top">
        <Android src={screenshotSrc} />
      </div>
    </div>
  ),
};
