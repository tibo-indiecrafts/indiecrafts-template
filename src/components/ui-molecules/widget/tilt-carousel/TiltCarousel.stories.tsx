import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Circle, Code, FileText, Layers, Layout } from "lucide-react";

import { TiltCarousel, type TiltCarouselItem } from "./index";

const meta: Meta<typeof TiltCarousel> = {
  title: "UI Molecules/Widget/TiltCarousel",
  component: TiltCarousel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TiltCarousel>;

const ITEMS: TiltCarouselItem[] = [
  {
    id: 1,
    title: "Text Animations",
    description: "Cool text animations for your projects.",
    icon: <FileText className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 2,
    title: "Animations",
    description: "Smooth animations for your projects.",
    icon: <Circle className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 3,
    title: "Components",
    description: "Reusable components for your projects.",
    icon: <Layers className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 4,
    title: "Backgrounds",
    description: "Beautiful backgrounds and patterns for your projects.",
    icon: <Layout className="h-[16px] w-[16px] text-white" />,
  },
  {
    id: 5,
    title: "Common UI",
    description: "Common UI components are coming soon!",
    icon: <Code className="h-[16px] w-[16px] text-white" />,
  },
];

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-[#0a0a0a]">
      <div className="relative" style={{ height: 600 }}>
        <TiltCarousel
          items={ITEMS}
          baseWidth={300}
          autoplay={false}
          autoplayDelay={3000}
          pauseOnHover={false}
          loop={false}
          round={false}
        />
      </div>
    </div>
  ),
};

export const Loop: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-[#0a0a0a]">
      <div className="relative" style={{ height: 600 }}>
        <TiltCarousel
          items={ITEMS}
          baseWidth={300}
          autoplay
          autoplayDelay={2500}
          pauseOnHover
          loop
        />
      </div>
    </div>
  ),
};

export const Round: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-[#0a0a0a]">
      <TiltCarousel
        items={ITEMS}
        baseWidth={400}
        autoplay
        autoplayDelay={2500}
        loop
        round
      />
    </div>
  ),
};
