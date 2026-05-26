import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactNetlify01Section, contactNetlify01Sample } from ".";

const meta = {
  title: "Sections/Contact/ContactNetlify01",
  component: ContactNetlify01Section,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ContactNetlify01Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...contactNetlify01Sample, id: "contact-demo" },
};
