import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";
import docs from "./table.md?raw";

const meta = {
  title: "Web/UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { id: "INV-001", status: "Paid", method: "Card", amount: "$250.00" },
  { id: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV-003", status: "Unpaid", method: "Transfer", amount: "$350.00" },
];

export const Default: Story = {
  render: () => (
    <Table className="w-96">
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.id}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell>{r.method}</TableCell>
            <TableCell className="text-right">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
