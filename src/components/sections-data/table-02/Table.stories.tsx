import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableSection from "./Table";
import { table02Sample } from "./config";

const meta: Meta<typeof TableSection> = {
  title: "Sections/Data/Table02",
  component: TableSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TableSection>;

export const Default: Story = {
  args: { ...table02Sample, id: "table-2-default" },
};
