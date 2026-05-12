/* eslint-disable @next/next/no-img-element -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StickyScroll } from "./sticky-scroll-reveal";

const meta: Meta<typeof StickyScroll> = {
  title: "UI Effects/Cards/StickyScrollReveal",
  component: StickyScroll,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StickyScroll>;

const CONTENT = [
  {
    title: "Config-first",
    description:
      "Forking the template means editing TypeScript files in src/config — not rewriting components. Brand strings, nav, and locales all live in one place.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-emerald-500 text-2xl font-bold text-white">
        Configure
      </div>
    ),
  },
  {
    title: "Type-safe i18n",
    description:
      "Every translation key flows through a MessageKey union derived from the message tree. Typos surface as compile errors, never runtime warnings.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-500 to-indigo-500 text-2xl font-bold text-white">
        Translate
      </div>
    ),
  },
  {
    title: "Accessible defaults",
    description:
      "WCAG 2.1 AA out of the box. Skip links, focus rings, semantic landmarks, and locale-aware typography helpers ship pre-wired.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500 text-2xl font-bold text-white">
        Accessible
      </div>
    ),
  },
];

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background w-full p-6">{children}</div>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <StickyScroll content={CONTENT} />
    </Frame>
  ),
};

export const TwoSections: Story = {
  render: () => (
    <Frame>
      <StickyScroll content={CONTENT.slice(0, 2)} />
    </Frame>
  ),
};

export const ImagePreviews: Story = {
  render: () => (
    <Frame>
      <StickyScroll
        content={[
          {
            title: "Atelier Lisbon",
            description: "A 19th-century carriage house turned design studio.",
            content: (
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            ),
          },
          {
            title: "Workshop Berlin",
            description: "Steel beams, a print press, a green plant or two.",
            content: (
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            ),
          },
          {
            title: "Maker Kyoto",
            description: "A quiet studio overlooking the Kamogawa.",
            content: (
              <img
                src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            ),
          },
        ]}
      />
    </Frame>
  ),
};

export const TallTile: Story = {
  render: () => (
    <Frame>
      <StickyScroll content={CONTENT} contentClassName="h-80 w-96" />
    </Frame>
  ),
};
