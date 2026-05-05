import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContainerTextFlip } from "./container-text-flip";

const meta: Meta<typeof ContainerTextFlip> = {
  title: "UI Effects/Text/ContainerTextFlip",
  component: ContainerTextFlip,
  parameters: { layout: "centered" },
  argTypes: {
    interval: { control: { type: "range", min: 500, max: 8000, step: 250 } },
    animationDuration: {
      control: { type: "range", min: 200, max: 2000, step: 50 },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ContainerTextFlip>;

/** Default — cycles through "better → modern → beautiful → awesome". */
export const Default: Story = {
  render: () => <ContainerTextFlip />,
};

/** Custom words — pass a `words` array to retune the cycle. */
export const CustomWords: Story = {
  render: () => <ContainerTextFlip words={["faster", "cheaper", "smarter", "kinder"]} />,
};

/** Long words — proves the pill resizes to fit each word's width. */
export const VariableWidth: Story = {
  render: () => (
    <ContainerTextFlip
      words={["dev", "prototype", "publish-ready", "production-grade"]}
    />
  ),
};

/** Fast cycle — `interval={1000}` for snappy hero animations. */
export const Fast: Story = {
  render: () => (
    <ContainerTextFlip words={["fast", "snappy", "instant", "rapid"]} interval={1000} />
  ),
};

/** Slow cycle — `interval={6000}` reads as a calmer, deliberate animation. */
export const Slow: Story = {
  render: () => (
    <ContainerTextFlip
      words={["calm", "thoughtful", "patient", "deliberate"]}
      interval={6000}
    />
  ),
};

/**
 * Hero pattern — pill stands alone above a subtitle. The pill's baked-in
 * vertical padding + shadow make it sit awkwardly inline with regular
 * heading text, so the recommended layout is centred above its own copy.
 */
export const HeroPattern: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3 text-center">
      <ContainerTextFlip words={["yours", "fast", "shippable", "open"]} />
      <p className="text-muted-foreground max-w-md text-sm">
        Make it yours. Edit a single config file to change the brand, the nav, the locale,
        the everything.
      </p>
    </div>
  ),
};
