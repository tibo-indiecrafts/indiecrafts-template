import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TimelineSection from "./Timeline";
import { timeline02Sample } from "./config";

const meta: Meta<typeof TimelineSection> = {
  title: "Sections/Timelines/Timeline02",
  component: TimelineSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TimelineSection>;

export const Default: Story = {
  args: { ...timeline02Sample, id: "timeline-2-default" },
};
