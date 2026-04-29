import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LayoutGrid } from "./layout-grid";

const meta: Meta<typeof LayoutGrid> = {
  title: "UI Effects/LayoutGrid",
  component: LayoutGrid,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LayoutGrid>;

const FOUR_CARDS = [
  {
    id: 1,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
    content: (
      <div>
        <h3 className="text-2xl font-bold text-white">Atelier in Bordeaux</h3>
        <p className="mt-2 max-w-md text-base text-white/80">
          A 19th-century carriage house turned design studio.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    content: (
      <div>
        <h3 className="text-2xl font-bold text-white">Workshop Berlin</h3>
        <p className="mt-2 max-w-md text-base text-white/80">
          Steel beams, a print press, a green plant or two.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    content: (
      <div>
        <h3 className="text-2xl font-bold text-white">Maker Kyoto</h3>
        <p className="mt-2 max-w-md text-base text-white/80">
          A quiet studio overlooking the Kamogawa.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    content: (
      <div>
        <h3 className="text-2xl font-bold text-white">Garage Oakland</h3>
        <p className="mt-2 max-w-md text-base text-white/80">
          A team of three, a 3D printer, lots of espresso.
        </p>
      </div>
    ),
  },
];

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background h-screen w-full">{children}</div>
);

/**
 * Default — four cards in a 3-column grid (`md:col-span-2` makes the wide
 * cards span two columns). Click any card to expand it via `motion`&apos;s
 * shared `layoutId`; click the dimmed overlay to close.
 */
export const Default: Story = {
  render: () => (
    <Frame>
      <LayoutGrid cards={FOUR_CARDS} />
    </Frame>
  ),
};

/** Three cards — exercises a single row layout. */
export const ThreeCards: Story = {
  render: () => (
    <Frame>
      <LayoutGrid
        cards={FOUR_CARDS.slice(0, 3).map((c) => ({
          ...c,
          className: "col-span-1",
        }))}
      />
    </Frame>
  ),
};

/** Single wide card — degenerate case; one full-width card. */
export const SingleCard: Story = {
  render: () => (
    <Frame>
      <LayoutGrid
        cards={[{ ...FOUR_CARDS[0], className: "md:col-span-3" }]}
      />
    </Frame>
  ),
};

/** Six cards — exercises a multi-row layout. */
export const SixCards: Story = {
  render: () => (
    <Frame>
      <LayoutGrid
        cards={[
          ...FOUR_CARDS,
          {
            id: 5,
            className: "col-span-1",
            thumbnail:
              "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
            content: (
              <div>
                <h3 className="text-2xl font-bold text-white">Loft Brooklyn</h3>
                <p className="mt-2 max-w-md text-base text-white/80">
                  Wall-to-wall whiteboards, exposed brick.
                </p>
              </div>
            ),
          },
          {
            id: 6,
            className: "md:col-span-2",
            thumbnail:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
            content: (
              <div>
                <h3 className="text-2xl font-bold text-white">Studio Lisbon</h3>
                <p className="mt-2 max-w-md text-base text-white/80">
                  Five floors above the Tagus.
                </p>
              </div>
            ),
          },
        ]}
      />
    </Frame>
  ),
};
