import type { GridListBlock, GridListPerson } from "./schema";

export const gridList02Key = "grid-list-02" as const;
export const gridList02Namespace = "blocks.grid-list-02" as const;

export const gridList02People: GridListPerson[] = [
  {
    id: "timur",
    name: "Timur Ercan",
    email: "timur@documenso.com",
    role: "Co-Founder / CEO",
    imageUrl: "https://blocks.so/avatar-02.png",
  },
  {
    id: "lucas",
    name: "Lucas Smith",
    email: "lucas@documenso.com",
    role: "Co-Founder / CTO",
    imageUrl: "https://blocks.so/avatar-03.png",
  },
  {
    id: "ephraim",
    name: "Ephraim Duncan",
    email: "ephraim@documenso.com",
    role: "Software Engineer",
    imageUrl: "https://blocks.so/avatar-01.png",
  },
  {
    id: "catalin",
    name: "Catalin Pit",
    email: "catalin@documenso.com",
    role: "Software Engineer",
    imageUrl: "https://blocks.so/avatar-04.png",
  },
];

export const gridList02Sample: Omit<GridListBlock, "id"> = {
  type: "grid-list-02",
  people: gridList02People,
};
