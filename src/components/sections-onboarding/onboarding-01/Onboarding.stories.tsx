import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import OnboardingSection from "./Onboarding";
import { onboarding01Sample } from "./config";

const meta: Meta<typeof OnboardingSection> = {
  title: "Sections/Onboarding/Onboarding01",
  component: OnboardingSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof OnboardingSection>;

export const Default: Story = {
  args: { ...onboarding01Sample, id: "onboarding-01-default" },
};
