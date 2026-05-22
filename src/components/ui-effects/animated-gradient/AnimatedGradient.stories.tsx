import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnimatedGradient } from "./index";

const meta: Meta<typeof AnimatedGradient> = {
  title: "UI Effects/Backgrounds/AnimatedGradient",
  component: AnimatedGradient,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AnimatedGradient>;

const GRADIENT_COLORS = ["#FF0000", "#FF4500", "#FF9900"];

interface BentoCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  align?: "left" | "center";
}

function BentoCard({
  title,
  subtitle,
  description,
  buttonText,
  align = "left",
}: BentoCardProps) {
  return (
    <div className="relative flex h-full min-h-[120px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#ff592f] p-4 font-medium sm:min-h-[180px] sm:p-6">
      <AnimatedGradient colors={GRADIENT_COLORS} speed={10} blur="medium" />
      <div
        className={`relative z-10 flex h-full w-full flex-1 flex-col justify-between ${
          align === "center" ? "items-center text-center" : "items-start text-left"
        }`}
      >
        <div>
          <div className="-mb-0.5 text-xs font-semibold text-white sm:text-sm md:text-base">
            {title}
          </div>
          {subtitle && (
            <div className="mb-1 text-[10px] text-white/80 sm:mb-2 sm:text-xs md:text-sm">
              {subtitle}
            </div>
          )}
        </div>
        {description && (
          <div className="mt-auto mb-1 text-[10px] leading-tight text-pretty text-white sm:mb-2 sm:text-xs">
            {description}
          </div>
        )}
        {buttonText && (
          <button
            type="button"
            className="mt-2 cursor-pointer rounded-full border border-white px-2 py-0.5 text-[10px] font-medium text-white transition-colors sm:mt-4 sm:px-3 sm:py-1 sm:text-xs"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export const Bento: Story = {
  render: () => (
    <div className="bg-background flex h-dvh w-full items-center justify-center px-20 py-8 sm:px-8 sm:py-16">
      <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-12">
        <div className="h-32 sm:col-span-8 sm:h-48">
          <BentoCard
            title="Animated Bento"
            subtitle="#001"
            description="Using only SVG circles and blur"
          />
        </div>
        <div className="h-32 sm:col-span-4 sm:h-48">
          <BentoCard title="Gradients" buttonText="Explore More" />
        </div>
      </div>
    </div>
  ),
};

export const FullBleed: Story = {
  render: () => (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <AnimatedGradient
        colors={["#7c3aed", "#ec4899", "#f97316"]}
        speed={8}
        blur="heavy"
      />
      <div className="relative z-10 flex h-full items-center justify-center text-5xl font-bold tracking-tight text-white md:text-7xl">
        ANIMATED
      </div>
    </div>
  ),
};
