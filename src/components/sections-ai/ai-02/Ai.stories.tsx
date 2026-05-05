import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AiSection from "./Ai";
import { ai02Sample } from "./config";

const meta: Meta<typeof AiSection> = {
  title: "Sections/Ai/Ai02",
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
  args: { ...ai02Sample, id: "ai-02-default" },
};
