import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./embla-carousel";
import docs from "./embla-carousel.md?raw";

const meta = {
  title: "Web/UI/EmblaCarousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-64">
      <CarouselContent>
        {[1, 2, 3, 4].map((n) => (
          <CarouselItem key={n}>
            <div className="bg-muted flex aspect-square items-center justify-center rounded-md text-4xl font-semibold">
              {n}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-4 flex justify-center gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  ),
};
