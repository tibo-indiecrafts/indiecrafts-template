/* eslint-disable @next/next/no-img-element -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Timeline } from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "UI Effects/Cards/Timeline",
  component: Timeline,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Timeline>;

const Body = ({ children }: { children: React.ReactNode }) => (
  <div className="text-muted-foreground space-y-3 text-sm md:text-base">{children}</div>
);

const FULL_DATA = [
  {
    title: "2024",
    content: (
      <Body>
        <p>
          Shipped the first iteration of the Indiecrafts template. Three client forks
          within the first month.
        </p>
        <p>
          React Compiler, Tailwind v4, and next-intl 4 lock-step upgrades — everything
          works on day one.
        </p>
      </Body>
    ),
  },
  {
    title: "2023",
    content: (
      <Body>
        <p>
          Drafted the config-first manifesto after the seventh time copying a
          marketing-site repo and changing twelve strings.
        </p>
        <p>
          Settled on per-page folders so translations live next to the page they describe.
        </p>
      </Body>
    ),
  },
  {
    title: "2022",
    content: (
      <Body>
        <p>
          Started experimenting with Next.js App Router previews and the new{" "}
          <code>next-intl</code> middleware approach.
        </p>
      </Body>
    ),
  },
  {
    title: "2021",
    content: (
      <Body>
        <p>
          The Indiecrafts studio launched with two designers and a developer in a Bordeaux
          carriage house.
        </p>
      </Body>
    ),
  },
];

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background w-full">{children}</div>
);

/**
 * Default — sticky timeline with a scroll-driven gradient line. Scroll the
 * canvas to see the purple→blue line draw down the left edge as each entry
 * comes into view.
 */
export const Default: Story = {
  render: () => (
    <Page>
      <Timeline data={FULL_DATA} />
    </Page>
  ),
};

/** Two entries — exercises the minimum viable list. */
export const TwoEntries: Story = {
  render: () => (
    <Page>
      <Timeline data={FULL_DATA.slice(0, 2)} />
    </Page>
  ),
};

/** Image entries — `content` slot accepts any ReactNode, not just text. */
export const WithImages: Story = {
  render: () => (
    <Page>
      <Timeline
        data={[
          {
            title: "Atelier",
            content: (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  A 19th-century carriage house turned design studio.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80"
                  alt=""
                  className="aspect-[16/9] w-full rounded-lg object-cover"
                />
              </div>
            ),
          },
          {
            title: "Workshop",
            content: (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  Steel beams, a print press, a green plant or two.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"
                  alt=""
                  className="aspect-[16/9] w-full rounded-lg object-cover"
                />
              </div>
            ),
          },
          {
            title: "Studio",
            content: (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  A quiet studio overlooking the Kamogawa.
                </p>
                <img
                  src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80"
                  alt=""
                  className="aspect-[16/9] w-full rounded-lg object-cover"
                />
              </div>
            ),
          },
        ]}
      />
    </Page>
  ),
};

/** Many entries — six steps stretch the gradient line further. */
export const ManyEntries: Story = {
  render: () => (
    <Page>
      <Timeline
        data={[
          ...FULL_DATA,
          {
            title: "2020",
            content: (
              <Body>
                <p>Pandemic year. Pivot to remote-first delivery.</p>
              </Body>
            ),
          },
          {
            title: "2019",
            content: (
              <Body>
                <p>First contract — a print magazine&apos;s online edition.</p>
              </Body>
            ),
          },
        ]}
      />
    </Page>
  ),
};
