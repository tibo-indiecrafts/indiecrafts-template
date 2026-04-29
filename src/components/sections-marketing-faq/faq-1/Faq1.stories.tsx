import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq1Section } from "./index";
import { faq1Sample } from "./config";

const meta: Meta<typeof Faq1Section> = {
  title: "Sections/Marketing/Faq/Faq1",
  component: Faq1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq1Section>;

export const Default: Story = {
  args: { ...faq1Sample, id: "story-faq-1" } as React.ComponentProps<typeof Faq1Section>,
};
