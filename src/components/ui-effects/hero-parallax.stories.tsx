import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroParallax } from "./hero-parallax";

const meta: Meta<typeof HeroParallax> = {
  title: "UI Effects/Cards/HeroParallax",
  component: HeroParallax,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HeroParallax>;

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800&q=80",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80",
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80",
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
];

const FIFTEEN = PRODUCT_IMAGES.map((thumbnail, i) => ({
  title: `Indiecrafts ${i + 1}`,
  link: `#product-${i + 1}`,
  thumbnail,
}));

const NATURE_IMAGES = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80",
  "https://images.unsplash.com/photo-1418065460487-3956c3030c7c?w=800&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
  "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  "https://images.unsplash.com/photo-1519981593452-666cf05569a9?w=800&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
  "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&q=80",
  "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
];

const NATURE = NATURE_IMAGES.map((thumbnail, i) => ({
  title: `Wilderness ${i + 1}`,
  link: `#wild-${i + 1}`,
  thumbnail,
}));

/**
 * Default — 15 products in three rows of five. Scroll the canvas to see the
 * 3D parallax tilt resolve and the rows pan in opposite directions. The
 * `products` array is split into three rows of `slice(0, 5)`,
 * `slice(5, 10)`, `slice(10, 15)`.
 */
export const Default: Story = {
  render: () => <HeroParallax products={FIFTEEN} />,
};

/**
 * Few products — fewer than 5 fills only the first row; rows 2 and 3 stay
 * empty. Useful as a smoke test for the empty-row case.
 */
export const FewProducts: Story = {
  render: () => <HeroParallax products={FIFTEEN.slice(0, 4)} />,
};

/** Two full rows — 10 products fill rows 1 and 2; row 3 stays empty. */
export const TwoRows: Story = {
  render: () => <HeroParallax products={FIFTEEN.slice(0, 10)} />,
};

/** Nature theme — same component, swapped imagery + titles. */
export const NatureTheme: Story = {
  render: () => <HeroParallax products={NATURE} />,
};
