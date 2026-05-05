import type { DialogBlock, DialogMember } from "./schema";

export const dialog08Key = "dialog-08" as const;
export const dialog08Namespace = "blocks.dialog-08" as const;

export const dialog08Members: DialogMember[] = [
  {
    name: "Ephraim Duncan",
    email: "ephraim@documenso.com",
    avatarUrl: "https://blocks.so/avatar-01.png",
    initials: "ED",
    status: "member",
  },
  {
    name: "Lucas Smith",
    email: "lucas@documenso.com",
    avatarUrl: "https://blocks.so/avatar-03.png",
    initials: "LS",
    status: "member",
  },
  {
    name: "Timur Ercan",
    email: "timur@documenso.com",
    avatarUrl: "https://blocks.so/avatar-02.jpg",
    initials: "TE",
    status: "member",
  },
  {
    name: "Catalin Pit",
    email: "catalin@documenso.com",
    avatarUrl: "https://blocks.so/avatar-04.jpg",
    initials: "CP",
    status: "member",
  },
];

export const dialog08Sample: Omit<DialogBlock, "id"> = {
  type: "dialog-08",
  defaultOpen: true,
  members: dialog08Members,
};
