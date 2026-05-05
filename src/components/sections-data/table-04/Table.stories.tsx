import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TableSection from "./Table";
import { table04Sample } from "./config";

const meta: Meta<typeof TableSection> = {
  title: "Sections/Data/Table04",
  component: TableSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TableSection>;

export const Default: Story = {
  args: { ...table04Sample, id: "table-4-default" },
};
