import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ParallaxScrollSecond } from "./parallax-scroll-2";

const meta: Meta<typeof ParallaxScrollSecond> = {
  title: "UI Effects/Marquees & Scroll/ParallaxScroll2",
  component: ParallaxScrollSecond,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ParallaxScrollSecond>;

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

const URBAN = [
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&q=80",
  "https://images.unsplash.com/photo-1496564203457-11bb12075d90?w=800&q=80",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
  "https://images.unsplash.com/photo-1496450681664-3df85efbd29f?w=800&q=80",
  "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
  "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80",
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
  "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=800&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
];

/**
 * Default — three-column scroll grid where the first column also rotates and
 * pans horizontally as you scroll, giving a more dramatic 3D feel than the
 * baseline `ParallaxScroll`.
 */
export const Default: Story = {
  render: () => <ParallaxScrollSecond images={IMAGES} />,
};

/** Urban theme — same component with city/architecture imagery. */
export const UrbanTheme: Story = {
  render: () => <ParallaxScrollSecond images={URBAN} />,
};

/** Few images — proves the layout is robust with fewer items. */
export const FewImages: Story = {
  render: () => <ParallaxScrollSecond images={IMAGES.slice(0, 6)} />,
};

/** Tall — `className="h-[60rem]"` overrides the default container height. */
export const Tall: Story = {
  render: () => <ParallaxScrollSecond images={IMAGES} className="h-[60rem]" />,
};
