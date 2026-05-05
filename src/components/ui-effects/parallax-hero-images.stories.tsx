import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ParallaxHeroImages } from "./parallax-hero-images";

const meta: Meta<typeof ParallaxHeroImages> = {
  title: "UI Effects/Marquees & Scroll/ParallaxHeroImages",
  component: ParallaxHeroImages,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "edge-focus"] },
  },
};
export default meta;

type Story = StoryObj<typeof ParallaxHeroImages>;

const IMAGES = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=600&q=80",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
];

const NATURE_IMAGES = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80",
  "https://images.unsplash.com/photo-1418065460487-3956c3030c7c?w=600&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80",
  "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=600&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80",
];

const Frame = ({
  title,
  images,
  variant,
}: {
  title: string;
  images: string[];
  variant?: "default" | "edge-focus";
}) => (
  <div className="bg-background relative h-[80vh] w-full overflow-hidden">
    <div className="relative z-10 mx-auto flex h-full max-w-2xl items-center justify-center px-6">
      <h1 className="text-foreground text-center text-5xl font-bold">{title}</h1>
    </div>
    <ParallaxHeroImages images={images} variant={variant} />
  </div>
);

/**
 * Default — eight images positioned around the viewport with `default` depth
 * weighting. Move the mouse to see them parallax-shift; the cards in the
 * middle ring move further than the corner ones.
 */
export const Default: Story = {
  render: () => <Frame title="Move your mouse around" images={IMAGES} />,
};

/**
 * Edge focus — `variant="edge-focus"` swaps the depth weighting so corner
 * images move more dramatically than centre ones; useful when the hero copy
 * sits in the middle.
 */
export const EdgeFocus: Story = {
  render: () => <Frame title="Edge focus" images={IMAGES} variant="edge-focus" />,
};

/** Nature theme — same component, different imagery set. */
export const NatureTheme: Story = {
  render: () => <Frame title="Wilderness" images={NATURE_IMAGES} />,
};

/**
 * Few images — passing fewer than 8 only fills the corresponding positions.
 * The component clamps to a max of 8 internally.
 */
export const FewImages: Story = {
  render: () => <Frame title="Just four" images={IMAGES.slice(0, 4)} />,
};
