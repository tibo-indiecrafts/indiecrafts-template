import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Android } from "./android";

const meta: Meta<typeof Android> = {
  title: "UI Effects/3D & Devices/Android",
  component: Android,
  parameters: { layout: "fullscreen" },
  // The phone SVG's path coordinates are drawn at 433×882 — the component
  // re-uses `width`/`height` for the viewBox, so passing smaller dims clips
  // the chassis bottom. Stories keep the native size and visual-scale via
  // CSS. The decorator negates the preview's `p-6` padding and lets the
  // phone scroll if the viewport is shorter than the rendered SVG.
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

/** Empty frame at default size — chassis only, no media. */
export const Default: Story = {};

/** Static screenshot inside the screen viewport (`src` prop). */
export const WithScreenshot: Story = {
  args: { src: screenshotSrc },
};

/** Looping muted video (`videoSrc` prop) — mounted in `<foreignObject>`. */
export const WithVideo: Story = {
  args: { videoSrc },
};

/**
 * Visual size variants — the SVG keeps its native viewBox, so we scale via
 * CSS transform rather than the `width`/`height` props (those alter the
 * viewBox and clip the chassis bottom).
 */
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
