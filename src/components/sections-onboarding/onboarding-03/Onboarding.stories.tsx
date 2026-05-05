import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import OnboardingSection from "./Onboarding";
import { onboarding03Sample } from "./config";

const meta: Meta<typeof OnboardingSection> = {
  title: "Sections/Onboarding/Onboarding03",
  component: OnboardingSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof OnboardingSection>;

export const Default: Story = {
  args: { ...onboarding03Sample, id: "onboarding-03-default" },
};
