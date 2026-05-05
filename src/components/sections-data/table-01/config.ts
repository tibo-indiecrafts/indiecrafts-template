import type { TableBlock, TableRow } from "./schema";

/** Block key — kebab-case. Used to look up `blocks.<key>.*`. */
export const table01Key = "table-01" as const;

/** Translation namespace — `useTranslations(table01Namespace)`. */
export const table01Namespace = "blocks.table-01" as const;

/**
 * Default rows shipped with the block. Forks pass their own `rows` prop
 * (or call site spreads `table01Sample` and overrides individual fields).
 */
export const table1Rows: TableRow[] = [
  {
    id: "001",
    name: "Project Alpha",
    category: "Development",
    value: 45_000,
    date: "2024-01-15",
    children: [
      {
        id: "001-01",
        name: "Frontend Module",
        category: "Development",
        value: 15_000,
        date: "2024-01-16",
      },
      {
        id: "001-02",
        name: "Backend Module",
        category: "Development",
        value: 20_000,
        date: "2024-01-21",
      },
      {
        id: "001-03",
        name: "Testing Suite",
        category: "Development",
        value: 10_000,
        date: "2024-01-24",
      },
    ],
  },
  {
    id: "002",
    name: "Marketing Campaign",
    category: "Marketing",
    value: 28_500,
    date: "2024-01-18",
    children: [
      {
        id: "002-01",
        name: "Social Media",
        category: "Marketing",
        value: 12_000,
        date: "2024-01-19",
      },
      {
        id: "002-02",
        name: "Email Marketing",
        category: "Marketing",
        value: 8_500,
        date: "2024-01-22",
      },
      {
        id: "002-03",
        name: "SEO Optimization",
        category: "Marketing",
        value: 8_000,
        date: "2024-01-23",
      },
    ],
  },
  {
    id: "003",
    name: "Infrastructure Upgrade",
    category: "Operations",
    value: 67_200,
    date: "2024-01-20",
    children: [
      {
        id: "003-01",
        name: "Cloud Migration",
        category: "Operations",
        value: 35_000,
        date: "2024-01-21",
      },
      {
        id: "003-02",
        name: "Security Enhancement",
        category: "Operations",
        value: 32_200,
        date: "2024-01-24",
      },
    ],
  },
  {
    id: "004",
    name: "Customer Support",
    category: "Service",
    value: 19_800,
    date: "2024-01-25",
  },
];

/**
 * Sample instance of the Table block. Spread into any page-template's
 * sections array (or pass to `<Table01Section {...table01Sample} id="..." />`).
 */
export const table01Sample: Omit<TableBlock, "id"> = {
  type: "table-01",
  titleKey: "blocks.table-01.title",
  rows: table1Rows,
  defaultOpenIndex: 0,
};
