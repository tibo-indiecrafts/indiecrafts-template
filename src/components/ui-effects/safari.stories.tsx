import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Safari } from "./safari";

const meta: Meta<typeof Safari> = {
  title: "UI Effects/3D & Devices/Safari",
  component: Safari,
  parameters: { layout: "centered" },
  argTypes: {
    mode: { control: "inline-radio", options: ["default", "simple"] },
    url: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Safari>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[600px] w-full items-center justify-center p-10">
    <div className="w-[800px] max-w-full">{children}</div>
  </div>
);

export const Default: Story = {
  args: { mode: "default", url: "indiecrafts.dev" },
  render: (args) => (
    <Stage>
      <Safari {...args} />
    </Stage>
  ),
};

export const WithImage: Story = {
  args: {
    mode: "default",
    url: "indiecrafts.dev/dashboard",
    imageSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80",
  },
  render: (args) => (
    <Stage>
      <Safari {...args} />
    </Stage>
  ),
};

export const WithVideo: Story = {
  args: {
    mode: "default",
    url: "indiecrafts.dev/demo",
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  render: (args) => (
    <Stage>
      <Safari {...args} />
    </Stage>
  ),
};

export const SimpleMode: Story = {
  args: {
    mode: "simple",
    url: "indiecrafts.dev",
    imageSrc: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1600&q=80",
  },
  render: (args) => (
    <Stage>
      <Safari {...args} />
    </Stage>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="bg-background flex min-h-[400px] w-full items-center justify-center p-10">
      <div className="w-[420px]">
        <Safari
          url="indiecrafts.dev"
          imageSrc="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"
        />
      </div>
    </div>
  ),
};
