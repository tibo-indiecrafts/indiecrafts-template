import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import {
  AdvancedCarousel,
  AdvancedCarouselContent,
  AdvancedCarouselIndicator,
  AdvancedCarouselItem,
  AdvancedCarouselNavigation,
} from "./index";

const meta: Meta<typeof AdvancedCarousel> = {
  title: "UI Molecules/Widget/AdvancedCarousel",
  component: AdvancedCarousel,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AdvancedCarousel>;

const FOUR = [1, 2, 3, 4];
const SEVEN = [1, 2, 3, 4, 5, 6, 7];

export const Basic: Story = {
  render: () => (
    <div className="relative w-full max-w-xs">
      <AdvancedCarousel itemsCount={FOUR.length}>
        <AdvancedCarouselContent>
          {FOUR.map((n) => (
            <AdvancedCarouselItem key={n} className="p-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                {n}
              </div>
            </AdvancedCarouselItem>
          ))}
        </AdvancedCarouselContent>
        <AdvancedCarouselNavigation alwaysShow />
        <AdvancedCarouselIndicator />
      </AdvancedCarousel>
    </div>
  ),
};

export const CustomSizes: Story = {
  render: () => (
    <div className="relative w-full max-w-xs">
      <AdvancedCarousel itemsCount={SEVEN.length}>
        <AdvancedCarouselContent>
          {SEVEN.map((n) => (
            <AdvancedCarouselItem key={n} className="basis-1/3">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                {n}
              </div>
            </AdvancedCarouselItem>
          ))}
        </AdvancedCarouselContent>
        <AdvancedCarouselNavigation />
      </AdvancedCarousel>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="relative w-[480px] max-w-full px-4 pb-24">
      <AdvancedCarousel itemsCount={SEVEN.length}>
        <AdvancedCarouselContent className="-ml-4">
          {SEVEN.map((n) => (
            <AdvancedCarouselItem key={n} className="basis-1/3 pl-4">
              <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                {n}
              </div>
            </AdvancedCarouselItem>
          ))}
        </AdvancedCarouselContent>
        <AdvancedCarouselNavigation
          alwaysShow
          className="absolute top-auto -bottom-20 left-auto w-full justify-end gap-2"
          classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
        />
      </AdvancedCarousel>
    </div>
  ),
};

export const CustomIndicator: Story = {
  render: () => {
    function Demo() {
      const [index, setIndex] = React.useState(0);
      return (
        <div className="relative w-full max-w-xs py-8">
          <AdvancedCarousel
            itemsCount={FOUR.length}
            index={index}
            onIndexChange={setIndex}
          >
            <AdvancedCarouselContent className="relative">
              {FOUR.map((item) => (
                <AdvancedCarouselItem key={item} className="p-4">
                  <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                    {item}
                  </div>
                </AdvancedCarouselItem>
              ))}
            </AdvancedCarouselContent>
          </AdvancedCarousel>
          <div className="flex w-full justify-center space-x-3 px-4">
            {FOUR.map((item) => (
              <button
                key={item}
                type="button"
                aria-label={`Go to slide ${item}`}
                onClick={() => setIndex(item - 1)}
                className={`h-12 w-12 border ${
                  index === item - 1
                    ? "border-zinc-950 dark:border-zinc-50"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
