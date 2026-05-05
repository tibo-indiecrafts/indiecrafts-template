import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./embla-carousel";

const meta: Meta<typeof Carousel> = {
  title: "UI Primitives/EmblaCarousel",
  component: Carousel,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <div className="w-[40rem]">
      <Carousel opts={{ align: "start", loop: true }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Featured</h3>
          <div className="flex items-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((i) => (
            <CarouselItem key={i} className="basis-1/3">
              <div className="bg-muted text-muted-foreground flex aspect-square items-center justify-center rounded-2xl text-3xl font-bold">
                {i}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};
