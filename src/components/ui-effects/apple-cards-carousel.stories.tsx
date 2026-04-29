import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, Carousel } from "./apple-cards-carousel";

const meta: Meta<typeof Carousel> = {
  title: "UI Effects/AppleCardsCarousel",
  component: Carousel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const CARD_DATA = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80",
    title: "You can do more with AI.",
    category: "Artificial Intelligence",
    content: (
      <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
        <p>
          The pace of change is unrelenting. Every team that adopts AI thoughtfully
          ships faster, hires more selectively, and frees up engineers to focus on
          the hard problems.
        </p>
        <p>
          Use AI for what it&apos;s great at: synthesising context, drafting first
          pass material, and surfacing what you didn&apos;t think to ask.
        </p>
      </div>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&q=80",
    title: "Enhance your productivity.",
    category: "Productivity",
    content: (
      <p className="text-muted-foreground text-sm leading-relaxed">
        Three apps. One window. Five keyboard shortcuts you should know to never
        again touch the trackpad while you&apos;re writing code.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&q=80",
    title: "Launching the new Apple Vision Pro.",
    category: "Product",
    content: (
      <p className="text-muted-foreground text-sm leading-relaxed">
        Spatial computing has arrived. We sat down with the engineering team to
        understand what changed, what shipped late, and what the next 5 years
        look like.
      </p>
    ),
  },
  {
    src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&q=80",
    title: "Maps and Wayfinding redesigned.",
    category: "Design",
    content: (
      <p className="text-muted-foreground text-sm leading-relaxed">
        A study in progressive disclosure: the map now hides 40% of its on-screen
        chrome by default and reveals it only when zoomed beyond street level.
      </p>
    ),
  },
];

const buildCards = (count: number) =>
  CARD_DATA.slice(0, count).map((c, i) => <Card key={i} card={c} index={i} />);

/** Default — four cards, default scroll position. */
export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full py-10">
      <Carousel items={buildCards(4)} />
    </div>
  ),
};

/** Initial scroll — opens the carousel mid-list via `initialScroll`. */
export const InitialScroll: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full py-10">
      <Carousel items={buildCards(4)} initialScroll={420} />
    </div>
  ),
};

/** Single card — proves the layout collapses cleanly with one item. */
export const SingleCard: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full py-10">
      <Carousel items={buildCards(1)} />
    </div>
  ),
};

/** Eight cards — demonstrates the horizontal scroll buttons becoming active. */
export const Many: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full py-10">
      <Carousel
        items={[...CARD_DATA, ...CARD_DATA].map((c, i) => (
          <Card key={i} card={c} index={i} />
        ))}
      />
    </div>
  ),
};
