import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardBody, CardContainer, CardItem } from "./3d-card";

const meta: Meta<typeof CardContainer> = {
  title: "UI Effects/3dCard",
  component: CardContainer,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CardContainer>;

const heroImage =
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&q=80";

/**
 * Default — image hero with a stacked title and CTA. Hover the card to see
 * the parallax tilt + per-`CardItem` translateZ depth.
 */
export const Default: Story = {
  render: () => (
    <CardContainer>
      <CardBody className="bg-card relative h-auto w-[420px] rounded-xl border p-6">
        <CardItem translateZ={50} className="text-xl font-bold">
          Make things float in air
        </CardItem>
        <CardItem
          as="p"
          translateZ={60}
          className="text-muted-foreground mt-2 max-w-sm text-sm"
        >
          Hover over this card to unleash the power of CSS perspectives.
        </CardItem>
        <CardItem translateZ={100} className="mt-4 w-full">
          <img
            src={heroImage}
            alt="Cat lounging on a fence"
            className="h-60 w-full rounded-md object-cover"
          />
        </CardItem>
        <div className="mt-6 flex items-center justify-between">
          <CardItem
            translateZ={20}
            as="a"
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-xs font-normal"
          >
            Try now →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="bg-foreground text-background rounded-full px-4 py-2 text-xs font-bold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  ),
};

/**
 * Text-only variant — proves the component works without media. The hover
 * tilt is driven by mouse position alone.
 */
export const TextOnly: Story = {
  render: () => (
    <CardContainer>
      <CardBody className="bg-card relative h-auto w-[360px] rounded-xl border p-8">
        <CardItem translateZ={40} className="text-xl font-bold">
          Quote of the day
        </CardItem>
        <CardItem
          as="blockquote"
          translateZ={30}
          className="text-muted-foreground mt-3 text-sm leading-relaxed italic"
        >
          &ldquo;Any sufficiently advanced technology is indistinguishable from
          magic.&rdquo;
        </CardItem>
        <CardItem translateZ={20} className="text-muted-foreground mt-4 text-xs">
          — Arthur C. Clarke
        </CardItem>
      </CardBody>
    </CardContainer>
  ),
};

/**
 * Multi-layer composition — five `CardItem`s at different `translateZ` depths.
 * Hover reveals the depth ordering most clearly.
 */
export const Layered: Story = {
  render: () => (
    <CardContainer>
      <CardBody className="bg-card relative h-72 w-[420px] rounded-xl border p-6">
        <CardItem translateZ={20} className="text-muted-foreground text-xs">
          Layer 1 — z=20
        </CardItem>
        <CardItem translateZ={50} className="mt-3 text-base font-medium">
          Layer 2 — z=50
        </CardItem>
        <CardItem translateZ={80} className="mt-3 text-lg font-semibold">
          Layer 3 — z=80
        </CardItem>
        <CardItem translateZ={120} className="mt-3 text-xl font-bold">
          Layer 4 — z=120
        </CardItem>
        <CardItem translateZ={160} className="mt-3 text-2xl font-bold">
          Layer 5 — z=160
        </CardItem>
      </CardBody>
    </CardContainer>
  ),
};

/**
 * Custom container size — pass `containerClassName` to constrain perspective
 * area (useful inside narrower layouts).
 */
export const Compact: Story = {
  render: () => (
    <CardContainer containerClassName="py-6">
      <CardBody className="bg-card relative h-44 w-[260px] rounded-lg border p-4">
        <CardItem translateZ={30} className="text-sm font-semibold">
          Compact
        </CardItem>
        <CardItem
          as="p"
          translateZ={40}
          className="text-muted-foreground mt-1 text-xs"
        >
          Tighter perspective for sidebar / grid usage.
        </CardItem>
      </CardBody>
    </CardContainer>
  ),
};
