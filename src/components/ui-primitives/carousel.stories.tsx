import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Carousel from "./carousel";

const meta: Meta<typeof Carousel> = {
  title: "UI Primitives/Carousel",
  component: Carousel,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const SLIDES = [
  {
    title: "Atelier in Bordeaux",
    button: "Visit",
    src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
  },
  {
    title: "Workshop Berlin",
    button: "Visit",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  },
  {
    title: "Maker Kyoto",
    button: "Visit",
    src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
  },
  {
    title: "Garage Oakland",
    button: "Visit",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  },
  {
    title: "Loft Brooklyn",
    button: "Visit",
    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  },
];

export const Default: Story = {
  render: () => (
    <div className="bg-background flex min-h-[80vh] w-full items-center justify-center">
      <Carousel slides={SLIDES} />
    </div>
  ),
};
