import { Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuoteList } from "./QuoteList";
import { Async } from "../_async-story";
import { img } from "../_mock";
import docs from "./QuoteList.md?raw";

// Async server component (reads translations via the Storybook next-intl mock).
// Unwrapped for the client runtime via `Async` + `Suspense`.
const meta = {
  title: "UI Components/QuoteList",
  component: QuoteList,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    _type: "module.quote-list",
    title: "What people say",
    quotes: [
      {
        _id: "q1",
        content: "The two-day path I needed — it saved me an afternoon.",
        author: "Katherine Johnson",
        role: "Engineer",
        image: img("kat"),
      },
      {
        _id: "q2",
        content: "One codebase, every client. Config-first is the way.",
        author: "Ada Lovelace",
        role: "Founder",
      },
    ],
  },
  argTypes: { quotes: { table: { disable: true } } },
  render: (args) => (
    <Suspense fallback={null}>
      <Async
        produce={() => QuoteList(args)}
        deps={[JSON.stringify(args.quotes)]}
      />
    </Suspense>
  ),
} satisfies Meta<typeof QuoteList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Single: Story = {
  args: {
    quotes: [
      { _id: "q1", content: "Short and sharp.", author: "Grace Hopper" },
    ],
  },
};
