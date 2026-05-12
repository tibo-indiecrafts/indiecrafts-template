import type { ContentBlock } from "./schema";

export const content18Key = "content-18" as const;
export const content18Namespace = "blocks.content-18" as const;

export const content18Sample: Omit<ContentBlock, "id"> = {
  type: "content-18",
  titleKey: "blocks.content-18.title",
  readMoreLabelKey: "blocks.content-18.readMore",
  cards: [
    {
      variant: "padded",
      image: {
        src: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/time_djv8te.webp",
        width: 1278,
        height: 900,
        altKey: "blocks.content-18.cards.card1.alt",
      },
      headingKey: "blocks.content-18.cards.card1.heading",
      bodyKey: "blocks.content-18.cards.card1.body",
      href: "#",
    },
    {
      variant: "padded",
      image: {
        src: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/dots-2_kmiukp.webp",
        width: 1388,
        height: 1388,
        altKey: "blocks.content-18.cards.card2.alt",
      },
      headingKey: "blocks.content-18.cards.card2.heading",
      bodyKey: "blocks.content-18.cards.card2.body",
      href: "#",
    },
    {
      variant: "filled",
      image: {
        src: "https://raw.githubusercontent.com/acme/assets/refs/heads/main/dna_lp2xey.webp",
        width: 1388,
        height: 1388,
        altKey: "blocks.content-18.cards.card3.alt",
      },
      headingKey: "blocks.content-18.cards.card3.heading",
      bodyKey: "blocks.content-18.cards.card3.body",
      href: "#",
    },
  ],
};
