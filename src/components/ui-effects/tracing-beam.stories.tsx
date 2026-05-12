/* eslint-disable @next/next/no-img-element -- Aceternity / MagicUI upstream */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TracingBeam } from "./tracing-beam";

const meta: Meta<typeof TracingBeam> = {
  title: "UI Effects/Cards/TracingBeam",
  component: TracingBeam,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TracingBeam>;

const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background w-full">{children}</div>
);

const Article = ({
  title,
  body,
  imgSrc,
}: {
  title: string;
  body: string;
  imgSrc?: string;
}) => (
  <div className="text-foreground mb-10">
    <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
    <p className="text-muted-foreground mb-6 leading-relaxed">{body}</p>
    {imgSrc && (
      <img src={imgSrc} alt="" className="aspect-[16/9] w-full rounded-lg object-cover" />
    )}
  </div>
);

const SAMPLE = (
  <div className="mx-auto max-w-2xl px-4 py-16">
    <Article
      title="Why config-first matters"
      body="Forking a template means editing TypeScript files in src/config — not rewriting components. Brand strings, nav, and locales all live in one place, and rebrands ship as a single commit."
      imgSrc="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80"
    />
    <Article
      title="Type-safe i18n by construction"
      body="Every translation key flows through a MessageKey union derived from the message tree. Typos surface as compile errors, never runtime warnings."
      imgSrc="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"
    />
    <Article
      title="Accessible defaults"
      body="WCAG 2.1 AA out of the box. Skip links, focus rings, semantic landmarks, and locale-aware typography helpers ship pre-wired."
      imgSrc="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80"
    />
    <Article
      title="Section blueprints"
      body="A section catalog of typed blueprints — hero, features, pricing, FAQ, testimonials — composed in a single page.config.ts. Per-page messages live next to the page they describe."
    />
  </div>
);

export const Default: Story = {
  render: () => (
    <Page>
      <TracingBeam>{SAMPLE}</TracingBeam>
    </Page>
  ),
};

export const ShortContent: Story = {
  render: () => (
    <Page>
      <TracingBeam>
        <div className="mx-auto max-w-2xl px-4 py-16">
          <Article
            title="One-page brief"
            body="Sometimes you only have one section to scroll through. The beam still works."
          />
        </div>
      </TracingBeam>
    </Page>
  ),
};

export const WideContent: Story = {
  render: () => (
    <Page>
      <TracingBeam className="!max-w-4xl">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <Article
            title="Full-width article"
            body="A wider variant for editorial pages. Tracing beam still hugs the left edge."
            imgSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
          />
          <Article
            title="Second section"
            body="Adding more content keeps the beam tracing as you scroll past each anchor."
          />
        </div>
      </TracingBeam>
    </Page>
  ),
};
