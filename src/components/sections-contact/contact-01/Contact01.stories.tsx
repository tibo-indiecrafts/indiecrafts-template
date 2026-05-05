import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactSection } from "./index";
import { contact01Sample } from "./config";

const meta: Meta<typeof ContactSection> = {
  title: "Sections/Contact/Contact01",
  component: ContactSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {
  args: { ...contact01Sample, id: "story-contact-01" } as React.ComponentProps<
    typeof ContactSection
  >,
};
