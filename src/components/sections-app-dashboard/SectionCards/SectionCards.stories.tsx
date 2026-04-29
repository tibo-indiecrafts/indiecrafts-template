import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionCards } from "./index";
import type { SectionCardItem } from "./config";

const meta: Meta<typeof SectionCards> = {
  title: "Sections/App/Dashboard/SectionCards",
  component: SectionCards,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      // The cards' grid uses `@xl/main` / `@5xl/main` container queries — they
      // need a parent marked `@container/main` to lay out responsively.
      <div className="@container/main w-full py-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SectionCards>;

/** Default — four KPI cards, the shadcn dashboard-01 demo set. */
export const Default: Story = {};

/**
 * Two cards — exercises the `@xl/main:grid-cols-2` breakpoint without filling
 * the four-column row.
 */
export const Compact: Story = {
  args: {
    items: [
      {
        descriptionKey: "revenue.description",
        value: "$1,250.00",
        badgeDelta: "+12.5%",
        trend: "up",
        footerTitleKey: "revenue.footerTitle",
        footerHintKey: "revenue.footerHint",
      },
      {
        descriptionKey: "growth.description",
        value: "4.5%",
        badgeDelta: "+4.5%",
        trend: "up",
        footerTitleKey: "growth.footerTitle",
        footerHintKey: "growth.footerHint",
      },
    ] satisfies SectionCardItem[],
  },
};

/**
 * Empty `items` — proves the grid renders cleanly with zero rows (no broken
 * spacing, no console warnings).
 */
export const Empty: Story = {
  args: { items: [] },
};
