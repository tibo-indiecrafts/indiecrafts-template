import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials01Section, type Testimonials01Block } from "./index";
import { testimonials01Sample } from "./config";

const meta: Meta<typeof Testimonials01Section> = {
  title: "Sections/Testimonials/Testimonials01",
  component: Testimonials01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials01Section>;

export const Default: Story = {
  args: {
    ...testimonials01Sample,
    id: "story-testimonials-01",
  } as React.ComponentProps<typeof Testimonials01Section>,
};

export const WithMultipleQuotes: Story = {
  args: {
    id: "story-testimonials-01-multiple",
    quotes: [
      ...testimonials01Sample.quotes,
      {
        id: "turing",
        quoteKey: "blocks.testimonials-01.quotes.lovelace.quote",
        authorKey: "blocks.testimonials-01.quotes.lovelace.author",
        roleKey: "blocks.testimonials-01.quotes.lovelace.role",
      },
      {
        id: "hopper",
        quoteKey: "blocks.testimonials-01.quotes.lovelace.quote",
        authorKey: "blocks.testimonials-01.quotes.lovelace.author",
        roleKey: "blocks.testimonials-01.quotes.lovelace.role",
      },
    ],
  } as Testimonials01Block,
};
