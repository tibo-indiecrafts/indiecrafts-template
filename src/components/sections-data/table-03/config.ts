import type { TableBlock, TableProduct } from "./schema";

export const table03Key = "table-03" as const;
export const table03Namespace = "blocks.table-03" as const;

export const table3Products: TableProduct[] = [
  {
    sku: "SKU-8472",
    productName: "Wireless Mouse Pro",
    stockLevel: 245,
    category: "Electronics",
    status: "active",
    unitPrice: "$24.99",
    lastRestocked: "Oct 15, 2024",
  },
  {
    sku: "SKU-3391",
    productName: "Ergonomic Keyboard",
    stockLevel: 89,
    category: "Electronics",
    status: "active",
    unitPrice: "$79.99",
    lastRestocked: "Oct 18, 2024",
  },
  {
    sku: "SKU-7156",
    productName: "Office Chair Deluxe",
    stockLevel: 12,
    category: "Furniture",
    status: "pending",
    unitPrice: "$299.99",
    lastRestocked: "Oct 12, 2024",
  },
  {
    sku: "SKU-9204",
    productName: "USB-C Hub Adapter",
    stockLevel: 456,
    category: "Accessories",
    status: "active",
    unitPrice: "$34.50",
    lastRestocked: "Oct 19, 2024",
  },
  {
    sku: "SKU-1638",
    productName: "Standing Desk Frame",
    stockLevel: 5,
    category: "Furniture",
    status: "on-hold",
    unitPrice: "$449.00",
    lastRestocked: "Oct 10, 2024",
  },
  {
    sku: "SKU-5529",
    productName: "Laptop Stand Aluminum",
    stockLevel: 178,
    category: "Accessories",
    status: "active",
    unitPrice: "$45.99",
    lastRestocked: "Oct 17, 2024",
  },
  {
    sku: "SKU-4817",
    productName: "Mechanical Keyboard RGB",
    stockLevel: 0,
    category: "Electronics",
    status: "discontinued",
    unitPrice: "$129.99",
    lastRestocked: "Oct 05, 2024",
  },
];

export const table03Sample: Omit<TableBlock, "id"> = {
  type: "table-03",
  titleKey: "blocks.table-03.title",
  descriptionKey: "blocks.table-03.description",
  products: table3Products,
};
