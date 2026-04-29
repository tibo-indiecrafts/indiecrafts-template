import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "UI Primitives/Accordion",
  component: Accordion,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

const ITEMS = [
  {
    value: "one",
    question: "What is the Indiecrafts template?",
    answer:
      "A config-first Next.js 16 starter for client websites. Fork it, edit src/config, ship.",
  },
  {
    value: "two",
    question: "Does it support i18n?",
    answer:
      "Yes — next-intl with locale-scoped routes, localized URL segments, and per-page translation files.",
  },
  {
    value: "three",
    question: "Is it accessible?",
    answer:
      "WCAG 2.1 AA out of the box with focus rings, skip links, and semantic landmarks.",
  },
];

export const Single: Story = {
  render: () => (
    <Accordion
      type="single"
      collapsible
      className="w-80"
      defaultValue="one"
    >
      {ITEMS.map((it) => (
        <AccordionItem key={it.value} value={it.value}>
          <AccordionTrigger>{it.question}</AccordionTrigger>
          <AccordionContent>{it.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-80" defaultValue={["one", "two"]}>
      {ITEMS.map((it) => (
        <AccordionItem key={it.value} value={it.value}>
          <AccordionTrigger>{it.question}</AccordionTrigger>
          <AccordionContent>{it.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
