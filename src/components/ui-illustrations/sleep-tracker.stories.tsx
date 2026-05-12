import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SleepTrackerIllustration } from "./sleep-tracker";

const meta: Meta<typeof SleepTrackerIllustration> = {
  title: "UI Illustrations/Sleep Tracker",
  component: SleepTrackerIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SleepTrackerIllustration>;
export const Default: Story = {};
