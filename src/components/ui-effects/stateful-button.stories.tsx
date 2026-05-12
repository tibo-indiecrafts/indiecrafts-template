import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./stateful-button";

const meta: Meta<typeof Button> = {
  title: "UI Effects/Buttons/StatefulButton",
  component: Button,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Button>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[200px] items-center justify-center p-12">
    {children}
  </div>
);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const Default: Story = {
  render: () => (
    <Stage>
      <Button onClick={() => sleep(1500)}>Save changes</Button>
    </Stage>
  ),
};

export const SlowHandler: Story = {
  render: () => (
    <Stage>
      <Button onClick={() => sleep(3000)}>Process payment</Button>
    </Stage>
  ),
};

export const Wider: Story = {
  render: () => (
    <Stage>
      <Button onClick={() => sleep(1200)} className="min-w-[200px] px-8 py-3">
        Submit application
      </Button>
    </Stage>
  ),
};

export const BrandColor: Story = {
  render: () => (
    <Stage>
      <Button
        onClick={() => sleep(1500)}
        className="bg-primary hover:ring-primary text-primary-foreground"
      >
        Get started
      </Button>
    </Stage>
  ),
};
