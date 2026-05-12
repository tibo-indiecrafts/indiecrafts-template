import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KpiCards } from "./index";
import type { KpiCardItem } from "./config";

const meta: Meta<typeof KpiCards> = {
  title: "UI Molecules/Widget/KpiCards",
  component: KpiCards,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="@container/main w-full py-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof KpiCards>;

export const Default: Story = {};

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
    ] satisfies KpiCardItem[],
  },
};

export const Empty: Story = {
  args: { items: [] },
};
