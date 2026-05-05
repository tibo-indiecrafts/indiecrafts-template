import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import OnboardingSection from "./Onboarding";
import { onboarding04Sample } from "./config";

const meta: Meta<typeof OnboardingSection> = {
  title: "Sections/Onboarding/Onboarding04",
  component: OnboardingSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof OnboardingSection>;

export const Default: Story = {
  args: { ...onboarding04Sample, id: "onboarding-04-default" },
};
