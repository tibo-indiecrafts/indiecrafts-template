import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroHighlight, Highlight } from "./hero-highlight";

const meta: Meta<typeof HeroHighlight> = {
  title: "UI Effects/HeroHighlight",
  component: HeroHighlight,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HeroHighlight>;

/**
 * Default — dot-pattern hero with a flashlight reveal that follows the
 * cursor. Wrap any phrase in `<Highlight>` to apply the animated
 * indigo-to-purple highlight stroke.
 */
export const Default: Story = {
  render: () => (
    <HeroHighlight>
      <h1 className="text-foreground mx-auto max-w-4xl px-4 text-center text-2xl font-bold md:text-4xl lg:text-5xl">
        Build sites your users{" "}
        <Highlight className="text-foreground">love to come back to</Highlight>
        , without the fluff.
      </h1>
    </HeroHighlight>
  ),
};

/** Compact — `containerClassName="h-[24rem]"` shrinks the hero. */
export const Compact: Story = {
  render: () => (
    <HeroHighlight containerClassName="h-[24rem]">
      <h2 className="text-foreground mx-auto max-w-2xl px-4 text-center text-xl font-bold md:text-3xl">
        A shorter hero for{" "}
        <Highlight className="text-foreground">secondary pages</Highlight>.
      </h2>
    </HeroHighlight>
  ),
};

/** No highlight — plain heading on the dot pattern, no background stroke. */
export const NoHighlight: Story = {
  render: () => (
    <HeroHighlight>
      <h1 className="text-foreground mx-auto max-w-3xl px-4 text-center text-2xl font-bold md:text-5xl">
        Move your cursor across the dots.
      </h1>
    </HeroHighlight>
  ),
};

/** Eyebrow + body — typical hero composition with subtitle. */
export const WithSubtitle: Story = {
  render: () => (
    <HeroHighlight>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-primary mb-4 text-xs font-semibold tracking-[0.3em] uppercase">
          Indiecrafts template
        </p>
        <h1 className="text-foreground text-3xl font-bold md:text-5xl">
          Ship a full client site in{" "}
          <Highlight className="text-foreground">a single weekend</Highlight>.
        </h1>
        <p className="text-muted-foreground mt-6 text-base md:text-lg">
          Fork the template, edit a few config files, ship. No framework setup,
          no design system to scaffold.
        </p>
      </div>
    </HeroHighlight>
  ),
};
