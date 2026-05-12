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

export const Default: Story = {
  render: () => <ContainerTextFlip />,
};

export const CustomWords: Story = {
  render: () => <ContainerTextFlip words={["faster", "cheaper", "smarter", "kinder"]} />,
};

export const VariableWidth: Story = {
  render: () => (
    <ContainerTextFlip
      words={["dev", "prototype", "publish-ready", "production-grade"]}
    />
  ),
};

export const Fast: Story = {
  render: () => (
    <ContainerTextFlip words={["fast", "snappy", "instant", "rapid"]} interval={1000} />
  ),
};

export const Slow: Story = {
  render: () => (
    <ContainerTextFlip
      words={["calm", "thoughtful", "patient", "deliberate"]}
      interval={6000}
    />
  ),
};

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
