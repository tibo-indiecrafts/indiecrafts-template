import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { MultiStepLoader } from "./multi-step-loader";

const meta: Meta<typeof MultiStepLoader> = {
  title: "UI Effects/Loaders & Progress/MultiStepLoader",
  component: MultiStepLoader,
  parameters: { layout: "fullscreen" },
  argTypes: {
    duration: { control: { type: "range", min: 500, max: 4000, step: 250 } },
    loop: { control: "boolean" },
    loading: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof MultiStepLoader>;

const STEPS = [
  { text: "Pulling configuration" },
  { text: "Validating theme tokens" },
  { text: "Compiling sections" },
  { text: "Generating routes" },
  { text: "Optimizing bundles" },
  { text: "Ready to ship" },
];

const SHORT_STEPS = [
  { text: "Connecting" },
  { text: "Authenticating" },
  { text: "Loading data" },
];

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative h-[80vh] w-full">{children}</div>
);

export const Default: Story = {
  args: { loading: true, loop: true, duration: 1500 },
  render: (args) => (
    <Frame>
      <MultiStepLoader {...args} loadingStates={STEPS} />
    </Frame>
  ),
};

export const Once: Story = {
  args: { loading: true, loop: false, duration: 1200 },
  render: (args) => (
    <Frame>
      <MultiStepLoader {...args} loadingStates={STEPS} />
    </Frame>
  ),
};

export const Slow: Story = {
  args: { loading: true, loop: true, duration: 3000 },
  render: (args) => (
    <Frame>
      <MultiStepLoader {...args} loadingStates={STEPS} />
    </Frame>
  ),
};

export const ShortList: Story = {
  args: { loading: true, loop: true, duration: 1500 },
  render: (args) => (
    <Frame>
      <MultiStepLoader {...args} loadingStates={SHORT_STEPS} />
    </Frame>
  ),
};

export const Toggle: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const start = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), STEPS.length * 1200 + 500);
    };
    return (
      <Frame>
        <div className="flex h-full w-full items-center justify-center">
          <Button onClick={start}>Run build</Button>
        </div>
        <MultiStepLoader
          loadingStates={STEPS}
          loading={loading}
          loop={false}
          duration={1200}
        />
      </Frame>
    );
  },
};
