import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SmoothScroll } from "@/components/ui-effects/smooth-scroll";

import { StackingCards, type StackingCardItem } from "./index";

const meta: Meta<typeof StackingCards> = {
  title: "UI Effects/Marquees & Scroll/StackingCards",
  component: StackingCards,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StackingCards>;

const SAMPLE: StackingCardItem[] = [
  {
    title: "Matthias Leidinger",
    description:
      "Originally hailing from Austria, Berlin-based photographer Matthias Leindinger is a young creative brimming with talent and ideas.",
    image:
      "https://images.unsplash.com/photo-1605106702842-01a887a31122?q=80&w=500&auto=format&fit=crop",
    color: "#5196fd",
    href: "#",
  },
  {
    title: "Clément Chapillon",
    description:
      "A story on the border between reality and the imaginary, about the contradictory feelings that the insularity of a rocky, arid, and wild territory provokes.",
    image:
      "https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32?w=500&auto=format&fit=crop&q=60",
    color: "#8f89ff",
    href: "#",
  },
  {
    title: "Zissou",
    description:
      "Though he views photography as a medium for storytelling, Zissou’s images don’t insist on a narrative. Both crisp and ethereal.",
    image:
      "https://images.unsplash.com/photo-1605106901227-991bd663255c?w=500&auto=format&fit=crop",
    color: "#13006c",
    href: "#",
  },
  {
    title: "Mathias Svold & Ulrik Hasemann",
    description:
      "The coastlines of Denmark are documented in tonal colors in a pensive new series investigating how humans interact with and disrupt the Danish coast.",
    image:
      "https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=500&auto=format&fit=crop&q=60",
    color: "#ed649e",
    href: "#",
  },
  {
    title: "Mark Rammers",
    description:
      "Dutch photographer Mark Rammers shared the first chapter of his latest project, captured during a residency at an old farm in Los Valles, Lanzarote.",
    image:
      "https://images.unsplash.com/photo-1506792006437-256b665541e2?w=500&auto=format&fit=crop",
    color: "#fd521a",
    href: "#",
  },
];

export const Default: Story = {
  render: () => (
    <SmoothScroll>
      <main className="bg-black">
        <header className="relative grid h-[70vh] w-full place-content-center bg-slate-950 text-white">
          <h2 className="px-8 text-center text-5xl leading-[120%] font-semibold tracking-tight 2xl:text-7xl">
            Stacking cards with motion. <br /> Scroll down 👇
          </h2>
        </header>
        <StackingCards items={SAMPLE} />
      </main>
    </SmoothScroll>
  ),
};
