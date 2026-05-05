import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AudioLinesIcon } from "./audio-lines";

const meta: Meta<typeof AudioLinesIcon> = {
  title: "UI Illustrations/AudioLines",
  component: AudioLinesIcon,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AudioLinesIcon>;

export const Default: Story = {};
