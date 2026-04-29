import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactSection } from "./index";
import { contact1Sample } from "./config";

const meta: Meta<typeof ContactSection> = {
  title: "Sections/Marketing/Contact/Contact1",
  component: ContactSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ContactSection>;

export const Default: Story = {
  args: { ...contact1Sample, id: "story-contact-1" } as React.ComponentProps<
    typeof ContactSection
  >,
};
