import type { TableBlock, TableTask } from "./schema";

export const table02Key = "table-02" as const;
export const table02Namespace = "blocks.table-02" as const;

export const table2Tasks: TableTask[] = [
  {
    id: "TASK-001",
    title: "Implement User Authentication",
    assignee: "Sarah Chen",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-03-25",
    notes: "OAuth 2.0 integration with Google and GitHub providers",
  },
  {
    id: "TASK-002",
    title: "Design Dashboard UI",
    assignee: "Michael Torres",
    status: "completed",
    priority: "medium",
    dueDate: "2024-03-20",
    notes: "Finalize dashboard layout with responsive grid system",
  },
  {
    id: "TASK-003",
    title: "API Performance Optimization",
    assignee: "Emma Rodriguez",
    status: "pending",
    priority: "urgent",
    dueDate: "2024-03-22",
    notes: "Reduce API response time by implementing caching strategy",
  },
  {
    id: "TASK-004",
    title: "Write Unit Tests",
    assignee: "James Wilson",
    status: "in-progress",
    priority: "medium",
    dueDate: "2024-03-28",
    notes: "Achieve 80% code coverage for authentication module",
  },
  {
    id: "TASK-005",
    title: "Database Migration",
    assignee: "Olivia Martinez",
    status: "blocked",
    priority: "high",
    dueDate: "2024-03-24",
    notes: "Waiting for infrastructure team approval before proceeding",
  },
  {
    id: "TASK-006",
    title: "Update Documentation",
    assignee: "Lucas Anderson",
    status: "pending",
    priority: "low",
    dueDate: "2024-03-30",
    notes: "Document new API endpoints and authentication flow",
  },
  {
    id: "TASK-007",
    title: "Security Audit",
    assignee: "Sophia Taylor",
    status: "completed",
    priority: "urgent",
    dueDate: "2024-03-19",
    notes: "Conducted comprehensive security review and vulnerability assessment",
  },
];

export const table02Sample: Omit<TableBlock, "id"> = {
  type: "table-02",
  titleKey: "blocks.table-02.title",
  tasks: table2Tasks,
};
