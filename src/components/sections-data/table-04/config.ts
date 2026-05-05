import type { TableBlock, TableGroup } from "./schema";

export const table04Key = "table-04" as const;
export const table04Namespace = "blocks.table-04" as const;

export const table4Groups: TableGroup[] = [
  {
    nameKey: "blocks.table-04.groups.engineering",
    items: [
      {
        id: "1",
        task: "API Integration Overhaul",
        budget: "$32,000",
        deadline: "Dec 15, 2024",
        assigned: [
          { name: "Marcus Chen", initials: "MC" },
          { name: "Priya Sharma", initials: "PS" },
        ],
        status: "in-progress",
      },
      {
        id: "2",
        task: "Database Migration",
        budget: "$18,500",
        deadline: "Jan 20, 2025",
        assigned: [{ name: "David Kim", initials: "DK" }],
        status: "completed",
      },
      {
        id: "3",
        task: "Mobile App Redesign",
        budget: "$55,000",
        deadline: "Feb 28, 2025",
        assigned: [
          { name: "Lena Rodriguez", initials: "LR" },
          { name: "Tom Anderson", initials: "TA" },
          { name: "Nina Patel", initials: "NP" },
        ],
        status: "planning",
      },
    ],
  },
  {
    nameKey: "blocks.table-04.groups.marketing",
    items: [
      {
        id: "4",
        task: "Q1 Campaign Launch",
        budget: "$24,000",
        deadline: "Jan 5, 2025",
        assigned: [
          { name: "Rachel Green", initials: "RG" },
          { name: "Chris Evans", initials: "CE" },
        ],
        status: "in-progress",
      },
      {
        id: "5",
        task: "Brand Refresh Project",
        budget: "$42,000",
        deadline: "Mar 1, 2025",
        assigned: [{ name: "Monica Geller", initials: "MG" }],
        status: "planning",
      },
    ],
  },
  {
    nameKey: "blocks.table-04.groups.operations",
    items: [
      {
        id: "6",
        task: "Vendor Contract Review",
        budget: "$8,000",
        deadline: "Dec 30, 2024",
        assigned: [
          { name: "Joe Tribbiani", initials: "JT" },
          { name: "Phoebe Buffay", initials: "PB" },
        ],
        status: "completed",
      },
      {
        id: "7",
        task: "Office Expansion Setup",
        budget: "$120,000",
        deadline: "Apr 15, 2025",
        assigned: [{ name: "Ross Geller", initials: "RG" }],
        status: "on-hold",
      },
    ],
  },
];

export const table04Sample: Omit<TableBlock, "id"> = {
  type: "table-04",
  titleKey: "blocks.table-04.title",
  groups: table4Groups,
};
