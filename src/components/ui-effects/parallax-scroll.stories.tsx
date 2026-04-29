import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ParallaxScroll } from "./parallax-scroll";

const meta: Meta<typeof ParallaxScroll> = {
  title: "UI Effects/ParallaxScroll",
  component: ParallaxScroll,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ParallaxScroll>;

const IMAGES = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
  "https://images.unsplash.com/photo-1523413307857-ed4e3331bf6c?w=800&q=80",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&q=80",
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  "https://images.unsplash.com/photo-1490604001847-b712b0c2f967?w=800&q=80",
];

const NATURE = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
  "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
];

/**
 * Default — 12-image grid split across three columns. Scroll the canvas
 * vertically to see each column drift at a different pace; the centre column
 * moves opposite to the outer two for a depth effect.
 */
export const Default: Story = {
  render: () => <ParallaxScroll images={IMAGES} />,
};

/** Nature theme — same component, swapped imagery. */
export const NatureTheme: Story = {
  render: () => <ParallaxScroll images={NATURE} />,
};

/** Few images — split across three columns, exercises the slim layout. */
export const FewImages: Story = {
  render: () => <ParallaxScroll images={IMAGES.slice(0, 6)} />,
};

/** Custom height — `className="h-[60rem]"` overrides the default 40rem container. */
export const Tall: Story = {
  render: () => <ParallaxScroll images={IMAGES} className="h-[60rem]" />,
};
