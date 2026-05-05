import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LineShadowText } from "./line-shadow-text";

const meta: Meta<typeof LineShadowText> = {
  title: "UI Effects/Text/LineShadowText",
  component: LineShadowText,
  parameters: { layout: "centered" },
  argTypes: {
    shadowColor: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof LineShadowText>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[260px] w-full items-center justify-center p-10">
    {children}
  </div>
);

/**
 * Default — diagonal-line drop shadow that animates leftward via the
 * `--animate-line-shadow` keyframes. The shadow is drawn from a CSS gradient
 * on a `::after` pseudo-element clipped to text via `attr(data-text)`.
 *
 * Note: `shadowColor` must be a real color value, not `currentColor` — the
 * `::after` already has `text-transparent` so `currentColor` resolves to
 * transparent and the gradient becomes invisible.
 */
export const Default: Story = {
  args: { shadowColor: "#0f172a" },
  render: (args) => (
    <Stage>
      <LineShadowText
        {...args}
        as="h1"
        className="text-foreground text-6xl font-bold italic"
      >
        Indiecrafts
      </LineShadowText>
    </Stage>
  ),
};

/** Brand shadow — paints the line shadow in the brand colour. */
export const BrandShadow: Story = {
  args: { shadowColor: "var(--color-primary)" },
  render: (args) => (
    <Stage>
      <LineShadowText
        {...args}
        as="h1"
        className="text-foreground text-6xl font-bold italic"
      >
        Stripes
      </LineShadowText>
    </Stage>
  ),
};

/** Display heading — used as a hero title at `text-8xl`. */
export const Hero: Story = {
  args: { shadowColor: "#ec4899" },
  render: (args) => (
    <Stage>
      <LineShadowText
        {...args}
        as="h1"
        className="text-foreground text-8xl leading-none font-extrabold tracking-tight italic"
      >
        Bold
      </LineShadowText>
    </Stage>
  ),
};

/** Inline — `as="span"` to embed inside a sentence. */
export const Inline: Story = {
  args: { shadowColor: "var(--color-primary)" },
  render: (args) => (
    <Stage>
      <p className="text-foreground max-w-md text-center text-2xl">
        Built with{" "}
        <LineShadowText {...args} className="font-bold italic">
          care
        </LineShadowText>
        , one config file at a time.
      </p>
    </Stage>
  ),
};
