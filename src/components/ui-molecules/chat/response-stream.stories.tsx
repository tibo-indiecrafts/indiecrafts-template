import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResponseStream } from "./response-stream";

const meta: Meta<typeof ResponseStream> = {
  title: "UI Molecules/Chat/ResponseStream",
  component: ResponseStream,
  parameters: { layout: "centered" },
  args: {
    textStream:
      "This is a typewriter-style streaming response. Each character appears with a small delay, simulating a real LLM stream.",
    mode: "typewriter",
    speed: 40,
  },
};
export default meta;

type Story = StoryObj<typeof ResponseStream>;

export const Default: Story = {};
