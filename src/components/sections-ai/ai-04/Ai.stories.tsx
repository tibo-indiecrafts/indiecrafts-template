import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AiSection from "./Ai";
import { ai04Sample } from "./config";

const meta: Meta<typeof AiSection> = {
  title: "Sections/Ai/Ai04",
  component: AiSection,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="mx-auto flex w-full max-w-5xl justify-center pt-12">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AiSection>;

export const Default: Story = {
  args: { ...ai04Sample, id: "ai-04-default" },
};
