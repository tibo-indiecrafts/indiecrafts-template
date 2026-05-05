import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableSection from "./Table";
import { table01Sample } from "./config";

const meta: Meta<typeof TableSection> = {
  title: "Sections/Data/Table01",
  component: TableSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TableSection>;

/** Default — sample data (4 rows, first one open). */
export const Default: Story = {
  args: { ...table01Sample, id: "table-1-default" },
};

/** Closed — every row collapsed at first paint. */
export const AllCollapsed: Story = {
  args: { ...table01Sample, id: "table-1-collapsed", defaultOpenIndex: -1 },
};
