import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TimelineSection from "./Timeline";
import { timeline01Sample } from "./config";

const meta: Meta<typeof TimelineSection> = {
  title: "Sections/Timelines/Timeline01",
  component: TimelineSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TimelineSection>;

export const Default: Story = {
  args: { ...timeline01Sample, id: "timeline-1-default" },
};
