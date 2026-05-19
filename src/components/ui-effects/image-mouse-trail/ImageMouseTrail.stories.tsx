import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ImageMouseTrail } from "./index";

const meta: Meta<typeof ImageMouseTrail> = {
  title: "UI Effects/Hover & Interactions/ImageMouseTrail",
  component: ImageMouseTrail,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ImageMouseTrail>;

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=600&auto=format",
  "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=600&auto=format",
];

export const Default: Story = {
  render: () => (
    <ImageMouseTrail items={SAMPLE_IMAGES}>
      <p className="pointer-events-none z-10 text-3xl font-semibold tracking-tight text-neutral-700">
        Move your cursor
      </p>
    </ImageMouseTrail>
  ),
};

export const FadeOnMove: Story = {
  render: () => (
    <ImageMouseTrail items={SAMPLE_IMAGES} fadeAnimation>
      <p className="pointer-events-none z-10 text-3xl font-semibold tracking-tight text-neutral-700">
        Fade-on-move
      </p>
    </ImageMouseTrail>
  ),
};
