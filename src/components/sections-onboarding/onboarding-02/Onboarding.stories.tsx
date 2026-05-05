import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import OnboardingSection from "./Onboarding";
import { onboarding02Sample } from "./config";

const meta: Meta<typeof OnboardingSection> = {
  title: "Sections/Onboarding/Onboarding02",
  component: OnboardingSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof OnboardingSection>;

export const Default: Story = {
  args: { ...onboarding02Sample, id: "onboarding-02-default" },
};
