/**
 * Block key — kebab-case folder name. Used to look up translations under `blocks.<key>.*`.
 */
export const dataTableKey = "data-table" as const;

/**
 * Translation namespace — `useTranslations(dataTableNamespace)` resolves keys from `en.json`.
 */
export const dataTableNamespace = "blocks.data-table" as const;

/**
 * View tab id used by the Tabs root and the mobile select. The translation
 * for each tab's label lives under `tabs.<id>` in the namespace.
 */
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

/**
 * Reviewer options surfaced in the per-row reviewer Select and the drawer
 * detail Select. Names are demo data — clients swap them per fork.
 */
export const dataTableReviewers: readonly string[] = [
  "Eddie Lake",
  "Jamik Tashpulatov",
  "Emily Whalen",
] as const;

/**
 * Section types surfaced in the drawer detail Select. Demo data — clients
 * swap per fork.
 */
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

/**
 * Page-size options for the bottom-right pagination Select.
 */
export const dataTablePageSizes: readonly number[] = [10, 20, 30, 40, 50] as const;

/**
 * Inline area-chart sample shown in the drawer body. Numerical sample —
 * clients replace with real data when wiring up the table to a backend.
 */
export const dataTableDrawerChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
] as const;
