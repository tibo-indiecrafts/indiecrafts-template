import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from "./index";

const meta: Meta<typeof ImageComparison> = {
  title: "UI Effects/Hover & Interactions/ImageComparison",
  component: ImageComparison,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ImageComparison>;

const NIGHT_IMG =
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=1200&auto=format&fit=crop";
const DAY_IMG =
  "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=1200&auto=format&fit=crop";

const containerClass =
  "aspect-[16/10] w-[640px] max-w-full rounded-lg border border-zinc-200 dark:border-zinc-800";

export const Basic: Story = {
  render: () => (
    <ImageComparison className={containerClass}>
      <ImageComparisonImage src={NIGHT_IMG} alt="Night scene" position="left" />
      <ImageComparisonImage src={DAY_IMG} alt="Day scene" position="right" />
      <ImageComparisonSlider className="bg-white" />
    </ImageComparison>
  ),
};

export const Hover: Story = {
  render: () => (
    <ImageComparison className={containerClass} enableHover>
      <ImageComparisonImage src={NIGHT_IMG} alt="Night scene" position="left" />
      <ImageComparisonImage src={DAY_IMG} alt="Day scene" position="right" />
      <ImageComparisonSlider className="bg-white" />
    </ImageComparison>
  ),
};

export const SpringHover: Story = {
  render: () => (
    <ImageComparison
      className={containerClass}
      enableHover
      springOptions={{ bounce: 0.3 }}
    >
      <ImageComparisonImage src={NIGHT_IMG} alt="Night scene" position="left" />
      <ImageComparisonImage src={DAY_IMG} alt="Day scene" position="right" />
      <ImageComparisonSlider className="w-0.5 bg-white/30 backdrop-blur-xs" />
    </ImageComparison>
  ),
};

export const CustomSlider: Story = {
  render: () => (
    <ImageComparison className={containerClass}>
      <ImageComparisonImage src={NIGHT_IMG} alt="Night scene" position="left" />
      <ImageComparisonImage src={DAY_IMG} alt="Day scene" position="right" />
      <ImageComparisonSlider className="w-2 bg-white/50 backdrop-blur-xs transition-colors hover:bg-white/80">
        <div className="absolute top-1/2 left-1/2 h-8 w-6 -translate-x-1/2 -translate-y-1/2 rounded bg-white" />
      </ImageComparisonSlider>
    </ImageComparison>
  ),
};
