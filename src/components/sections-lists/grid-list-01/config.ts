import type { GridListBlock, GridListItem } from "./schema";

export const gridList01Key = "grid-list-01" as const;
export const gridList01Namespace = "blocks.grid-list-01" as const;

export const gridList01Items: GridListItem[] = [
  { id: "scifi", href: "#", books: 37 },
  { id: "mystery", href: "#", books: 29 },
  { id: "historical", href: "#", books: 23 },
];

export const gridList01Sample: Omit<GridListBlock, "id"> = {
  type: "grid-list-01",
  items: gridList01Items,
};
