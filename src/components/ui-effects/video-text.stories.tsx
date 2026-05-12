import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VideoText } from "./video-text";

const meta: Meta<typeof VideoText> = {
  title: "UI Effects/Text/VideoText",
  component: VideoText,
  parameters: { layout: "fullscreen" },
  argTypes: {
    fontSize: { control: { type: "range", min: 5, max: 40, step: 1 } },
    fontWeight: { control: "text" },
    fontFamily: { control: "text" },
    autoPlay: { control: "boolean" },
    muted: { control: "boolean" },
    loop: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof VideoText>;

const VIDEO_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-[460px] w-full items-center justify-center bg-slate-950 p-10">
    <div className="h-72 w-full max-w-3xl">{children}</div>
  </div>
);

export const Default: Story = {
  args: { fontSize: 20 },
  render: (args) => (
    <Stage>
      <VideoText {...args} src={VIDEO_SRC}>
        INDIECRAFTS
      </VideoText>
    </Stage>
  ),
};

export const ShortWord: Story = {
  args: { fontSize: 30 },
  render: (args) => (
    <Stage>
      <VideoText {...args} src={VIDEO_SRC}>
        BUILD
      </VideoText>
    </Stage>
  ),
};

export const SmallerType: Story = {
  args: { fontSize: 10 },
  render: (args) => (
    <Stage>
      <VideoText {...args} src={VIDEO_SRC}>
        VIDEO TEXT
      </VideoText>
    </Stage>
  ),
};

export const SerifFont: Story = {
  args: { fontSize: 22, fontFamily: "Georgia, serif" },
  render: (args) => (
    <Stage>
      <VideoText {...args} src={VIDEO_SRC}>
        Studio
      </VideoText>
    </Stage>
  ),
};

export const NoAutoplay: Story = {
  args: { autoPlay: false, fontSize: 20 },
  render: (args) => (
    <Stage>
      <VideoText {...args} src={VIDEO_SRC}>
        STILL
      </VideoText>
    </Stage>
  ),
};
