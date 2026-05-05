import type { TableBlock, TableItem } from "./schema";

export const table05Key = "table-05" as const;
export const table05Namespace = "blocks.table-05" as const;

export const table5Items: TableItem[] = [
  {
    id: "1",
    name: "Project Alpha",
    date: "Jan 15, 2024",
    status: "completed",
    amount: "$2,500",
  },
  {
    id: "2",
    name: "Website Redesign",
    date: "Feb 3, 2024",
    status: "processing",
    amount: "$4,200",
  },
  {
    id: "3",
    name: "Mobile App MVP",
    date: "Feb 18, 2024",
    status: "pending",
    amount: "$8,750",
  },
  {
    id: "4",
    name: "Brand Identity",
    date: "Mar 5, 2024",
    status: "completed",
    amount: "$1,800",
  },
  {
    id: "5",
    name: "Marketing Campaign",
    date: "Mar 22, 2024",
    status: "cancelled",
    amount: "$3,400",
  },
  {
    id: "6",
    name: "Analytics Dashboard",
    date: "Apr 8, 2024",
    status: "processing",
    amount: "$5,600",
  },
  {
    id: "7",
    name: "E-commerce Platform",
    date: "Apr 25, 2024",
    status: "pending",
    amount: "$12,000",
  },
  {
    id: "8",
    name: "API Integration",
    date: "May 10, 2024",
    status: "completed",
    amount: "$3,200",
  },
];

export const table05Sample: Omit<TableBlock, "id"> = {
  type: "table-05",
  titleKey: "blocks.table-05.title",
  items: table5Items,
  pageSize: 5,
};
