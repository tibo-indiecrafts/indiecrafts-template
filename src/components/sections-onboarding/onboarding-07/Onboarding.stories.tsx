import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import OnboardingSection from "./Onboarding";
import { onboarding07Sample } from "./config";

const meta: Meta<typeof OnboardingSection> = {
  title: "Sections/Onboarding/Onboarding07",
  component: OnboardingSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof OnboardingSection>;

export const Default: Story = {
  args: { ...onboarding07Sample, id: "onboarding-07-default" },
};
