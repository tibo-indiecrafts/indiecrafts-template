import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DataTable } from "./index";

const meta: Meta<typeof DataTable> = {
  title: "Sections/Data/DataTable",
  component: DataTable,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DataTable>;

const sampleRows = [
  {
    id: 1,
    header: "Cover page",
    type: "Cover page",
    status: "In Process",
    target: "18",
    limit: "5",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Table of contents",
    type: "Table of contents",
    status: "Done",
    target: "29",
    limit: "24",
    reviewer: "Eddie Lake",
  },
  {
    id: 3,
    header: "Executive summary",
    type: "Narrative",
    status: "Done",
    target: "10",
    limit: "13",
    reviewer: "Eddie Lake",
  },
];

const sectionTypes = [
  "Cover page",
  "Table of contents",
  "Narrative",
  "Technical Approach",
  "Design",
  "Capabilities",
  "Focus Documents",
  "Executive summary",
];

const statuses = ["Done", "In Process", "Not Started"];

const reviewers = ["Eddie Lake", "Jamik Tashpulatov", "Emily Whalen"];

const generateRows = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    header: `Section ${i + 1}`,
    type: sectionTypes[i % sectionTypes.length],
    status: statuses[i % statuses.length],
    target: `${(i + 1) * 4}`,
    limit: `${(i + 1) * 2}`,
    reviewer: reviewers[i % reviewers.length],
  }));

export const Default: Story = {
  args: { data: sampleRows },
};

export const Paginated: Story = {
  args: { data: generateRows(30) },
};

export const Empty: Story = {
  args: { data: [] },
};
