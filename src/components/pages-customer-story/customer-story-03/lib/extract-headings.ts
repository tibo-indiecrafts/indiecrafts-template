import { slugify } from "./slugify";
import { PortableTextBlock } from "@portabletext/types";

export type Heading = {
  text: string;
  level: 2 | 3;
  slug: string;
};

export function extractHeadings(body: PortableTextBlock[]): Heading[] {
  if (!body) return [];

  return body
    .filter(
      (block): block is PortableTextBlock =>
        block._type === "block" && ["h2", "h3"].includes(block.style || ""),
    )
    .map((block) => {
      const text =
        block.children?.map((child) => ("text" in child ? child.text : "")).join("") ||
        "";
      return {
        text,
        level: block.style === "h2" ? 2 : 3,
        slug: slugify(text),
      } as Heading;
    });
}
