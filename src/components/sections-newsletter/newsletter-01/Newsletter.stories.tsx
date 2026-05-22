import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Newsletter01Section, newsletter01Sample } from ".";

const meta = {
  title: "Sections/Newsletter/Newsletter01",
  component: Newsletter01Section,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Newsletter01Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...newsletter01Sample, id: "newsletter-demo" },
};

export const WithoutEyebrow: Story = {
  args: {
    ...newsletter01Sample,
    eyebrowKey: undefined,
    id: "newsletter-no-eyebrow",
  },
};

export const Minimal: Story = {
  args: {
    type: "newsletter-01",
    titleKey: "blocks.newsletter-01.title",
    emailPlaceholderKey: "blocks.newsletter-01.emailPlaceholder",
    submitLabelKey: "blocks.newsletter-01.submit",
    id: "newsletter-minimal",
  },
};
