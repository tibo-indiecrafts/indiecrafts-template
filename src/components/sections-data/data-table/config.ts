export const dataTableKey = "data-table" as const;

export const dataTableNamespace = "blocks.data-table" as const;

export type DataTableViewId =
  | "outline"
  | "past-performance"
  | "key-personnel"
  | "focus-documents";

export const dataTableViews: readonly {
  id: DataTableViewId;
  badge?: string;
}[] = [
  { id: "outline" },
  { id: "past-performance", badge: "3" },
  { id: "key-personnel", badge: "2" },
  { id: "focus-documents" },
] as const;

export const dataTableReviewers: readonly string[] = [
  "Eddie Lake",
  "Jamik Tashpulatov",
  "Emily Whalen",
] as const;

export const dataTableSectionTypes: readonly string[] = [
  "Table of Contents",
  "Executive Summary",
  "Technical Approach",
  "Design",
  "Capabilities",
  "Focus Documents",
  "Narrative",
  "Cover Page",
] as const;

export const dataTableStatuses: readonly string[] = [
  "Done",
  "In Progress",
  "Not Started",
] as const;

export const dataTablePageSizes: readonly number[] = [10, 20, 30, 40, 50] as const;

export const dataTableDrawerChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
] as const;
