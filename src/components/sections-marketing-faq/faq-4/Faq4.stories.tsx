import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Faq4Section } from "./index";
import { faq4Sample } from "./config";

const meta: Meta<typeof Faq4Section> = {
  title: "Sections/Marketing/Faq/Faq4",
  component: Faq4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Faq4Section>;

export const Default: Story = {
  args: { ...faq4Sample, id: "story-faq-4" } as React.ComponentProps<typeof Faq4Section>,
};
