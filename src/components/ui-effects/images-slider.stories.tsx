/* eslint-disable react-hooks/purity -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo } from "react";
import { ImagesSlider } from "./images-slider";

const meta: Meta<typeof ImagesSlider> = {
  title: "UI Effects/Social/ImagesSlider",
  component: ImagesSlider,
  parameters: { layout: "fullscreen" },
  argTypes: {
    direction: { control: "inline-radio", options: ["up", "down"] },
    autoplay: { control: "boolean" },
    overlay: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof ImagesSlider>;

const PALETTES = {
  scenic: [
    ["0f172a", "f8fafc", "Sunrise"],
    ["be185d", "fdf2f8", "Bloom"],
    ["0e7490", "ecfeff", "Coast"],
    ["166534", "ecfdf5", "Forest"],
  ],
  urban: [
    ["18181b", "fafafa", "Skyline"],
    ["4338ca", "eef2ff", "Avenue"],
    ["b91c1c", "fef2f2", "Marquee"],
    ["0f766e", "f0fdfa", "Plaza"],
  ],
} as const;

function useFreshSlides(palette: keyof typeof PALETTES) {
  return useMemo(() => {
    const session = Math.random().toString(36).slice(2);
    return PALETTES[palette].map(
      ([bg, fg, label], i) =>
        `https://placehold.co/1600x900/${bg}/${fg}.png?text=${encodeURIComponent(
          label,
        )}&s=${session}-${i}`,
    );
  }, [palette]);
}

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-[70vh] w-full">{children}</div>
);

const HeroCopy = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="z-50 flex flex-col items-center justify-center px-6 text-center">
    <h2 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">{title}</h2>
    <p className="mt-4 max-w-md text-base text-white/90 md:text-lg">{subtitle}</p>
  </div>
);

export const Default: Story = {
  render: () => {
    const images = useFreshSlides("scenic");
    return (
      <Frame>
        <ImagesSlider images={images}>
          <HeroCopy
            title="Built with care"
            subtitle="A photo backdrop for your hero — autoplays through curated images."
          />
        </ImagesSlider>
      </Frame>
    );
  },
};

export const DirectionDown: Story = {
  render: () => {
    const images = useFreshSlides("urban");
    return (
      <Frame>
        <ImagesSlider images={images} direction="down">
          <HeroCopy
            title="Falling through"
            subtitle="Each slide exits downward instead of upward."
          />
        </ImagesSlider>
      </Frame>
    );
  },
};

export const NoAutoplay: Story = {
  render: () => {
    const images = useFreshSlides("scenic");
    return (
      <Frame>
        <ImagesSlider images={images} autoplay={false}>
          <HeroCopy
            title="Manual control"
            subtitle="Use ← / → arrow keys to advance the slides."
          />
        </ImagesSlider>
      </Frame>
    );
  },
};

export const NoOverlay: Story = {
  render: () => {
    const images = useFreshSlides("urban");
    return (
      <Frame>
        <ImagesSlider images={images} overlay={false}>
          <HeroCopy
            title="Full colour"
            subtitle="The dim overlay is removed; useful when photos themselves carry contrast."
          />
        </ImagesSlider>
      </Frame>
    );
  },
};

export const TintedOverlay: Story = {
  render: () => {
    const images = useFreshSlides("scenic");
    return (
      <Frame>
        <ImagesSlider images={images} overlayClassName="bg-primary/50 mix-blend-multiply">
          <HeroCopy
            title="Brand tinted"
            subtitle="Use overlayClassName to apply your brand colour at any opacity."
          />
        </ImagesSlider>
      </Frame>
    );
  },
};
