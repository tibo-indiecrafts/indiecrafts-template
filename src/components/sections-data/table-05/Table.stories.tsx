import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableSection from "./Table";
import { table05Sample } from "./config";

const meta: Meta<typeof TableSection> = {
  title: "Sections/Data/Table05",
  component: TableSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TableSection>;

export const Default: Story = {
  args: { ...table05Sample, id: "table-5-default" },
};

export const TenPerPage: Story = {
  args: { ...table05Sample, id: "table-5-ten", pageSize: 10 },
};
