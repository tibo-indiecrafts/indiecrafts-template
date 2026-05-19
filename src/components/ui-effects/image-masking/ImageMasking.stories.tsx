import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ImageMasking } from "./index";

const meta: Meta<typeof ImageMasking> = {
  title: "UI Effects/Masking/ImageMasking",
  component: ImageMasking,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ImageMasking>;

export const Default: Story = {
  render: () => (
    <div className="w-[min(90vw,720px)]">
      <ImageMasking />
    </div>
  ),
};

export const CustomSource: Story = {
  render: () => (
    <div className="w-[min(90vw,720px)]">
      <ImageMasking
        src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop"
        alt="Forest landscape"
        fallbackColor="oklch(0.55 0.18 260)"
      />
    </div>
  ),
};
