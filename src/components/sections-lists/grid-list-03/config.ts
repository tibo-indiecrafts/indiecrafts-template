import type { GridListBlock, GridListItem } from "./schema";

export const gridList03Key = "grid-list-03" as const;
export const gridList03Namespace = "blocks.grid-list-03" as const;

export const gridList03Items: GridListItem[] = [
  { id: "gettingStarted", icon: "ArrowRight", tone: "green", href: "#" },
  { id: "adminSettings", icon: "UserCircle", tone: "red", href: "#" },
  { id: "serverSetup", icon: "Server", tone: "blue", href: "#" },
  { id: "loginVerification", icon: "CheckCircle", tone: "sky", href: "#" },
  { id: "accountSetup", icon: "ContactRound", tone: "pink", href: "#" },
  { id: "trustSafety", icon: "Hand", tone: "orange", href: "#" },
];

export const gridList03Sample: Omit<GridListBlock, "id"> = {
  type: "grid-list-03",
  items: gridList03Items,
};
