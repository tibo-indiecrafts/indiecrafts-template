import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextToSpeechIllustration } from "./text-to-speech";

const meta: Meta<typeof TextToSpeechIllustration> = {
  title: "UI Illustrations/Text To Speech",
  component: TextToSpeechIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TextToSpeechIllustration>;
export const Default: Story = {};
