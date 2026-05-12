import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FocusCards } from "./focus-cards";

const meta: Meta<typeof FocusCards> = {
  title: "UI Effects/Cards/FocusCards",
  component: FocusCards,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FocusCards>;

const SIX_CARDS = [
  {
    title: "Atelier in Lisbon",
    src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
  },
  {
    title: "Studio Bordeaux",
    src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  },
  {
    title: "Workshop Berlin",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    title: "Loft Brooklyn",
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
  },
  {
    title: "Maker Kyoto",
    src: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
  },
  {
    title: "Garage Oakland",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
];

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background w-full px-4 py-10 [&_img]:h-full [&_img]:w-full">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stage>
      <FocusCards cards={SIX_CARDS} />
    </Stage>
  ),
};

export const ThreeCards: Story = {
  render: () => (
    <Stage>
      <FocusCards cards={SIX_CARDS.slice(0, 3)} />
    </Stage>
  ),
};

export const SingleCard: Story = {
  render: () => (
    <Stage>
      <FocusCards cards={[SIX_CARDS[0]]} />
    </Stage>
  ),
};

export const ManyCards: Story = {
  render: () => (
    <Stage>
      <FocusCards
        cards={[
          ...SIX_CARDS,
          {
            title: "Garden Tokyo",
            src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
          },
          {
            title: "Cabin Norway",
            src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
          },
        ]}
      />
    </Stage>
  ),
};
