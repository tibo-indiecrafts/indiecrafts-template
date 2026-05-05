import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableSection from "./Table";
import { table03Sample } from "./config";

const meta: Meta<typeof TableSection> = {
  title: "Sections/Data/Table03",
  component: TableSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TableSection>;

export const Default: Story = {
  args: { ...table03Sample, id: "table-3-default" },
};
