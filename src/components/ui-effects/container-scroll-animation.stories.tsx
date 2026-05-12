/* eslint-disable @next/next/no-img-element -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContainerScroll } from "./container-scroll-animation";

const meta: Meta<typeof ContainerScroll> = {
  title: "UI Effects/Marquees & Scroll/ContainerScrollAnimation",
  component: ContainerScroll,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ContainerScroll>;

const ScreenshotCard = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    className="mx-auto h-full w-full rounded-2xl object-cover object-left-top"
    width={1400}
    height={720}
  />
);

export const Default: Story = {
  render: () => (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <h2 className="text-3xl font-semibold md:text-5xl">
            Unleash the power of <br />
            <span className="text-foreground mt-1 inline-block text-4xl font-bold md:text-7xl">
              Indiecrafts
            </span>
          </h2>
        }
      >
        <ScreenshotCard
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80"
          alt="Editor screenshot"
        />
      </ContainerScroll>
    </div>
  ),
};

export const HeroWithCta: Story = {
  render: () => (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-semibold md:text-5xl">
              Watch the dashboard come together.
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm md:text-base">
              Six widgets, one config file. Scroll to see the screenshot tilt into view.
            </p>
            <button className="bg-foreground text-background mt-2 rounded-full px-5 py-2 text-sm font-medium">
              Try the demo
            </button>
          </div>
        }
      >
        <ScreenshotCard
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80"
          alt="Analytics dashboard"
        />
      </ContainerScroll>
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll titleComponent="Scroll to reveal">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500">
          <p className="text-3xl font-semibold text-white">Hero content</p>
        </div>
      </ContainerScroll>
    </div>
  ),
};
