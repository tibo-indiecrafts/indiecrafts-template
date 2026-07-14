import type { PortableTextBlock } from "@portabletext/react";
import { logger } from "@/lib/logger";

/**
 * Minimal PortableText → Markdown serializer. Handles the block / span /
 * image / link shapes used by our blockContent schema. Skips unknown
 * types silently rather than throwing — the route should always return
 * something even when an editor adds a new block type before the
 * serializer is updated.
 */
export function portableTextToMarkdown(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => blockToMarkdown(block as unknown as Record<string, unknown>))
    .filter(Boolean)
    .join("\n\n");
}

function blockToMarkdown(block: Record<string, unknown>): string {
  const type = block._type as string | undefined;

  if (type === "block") {
    const children = (block.children as Record<string, unknown>[] | undefined) ?? [];
    const markDefs = (block.markDefs as Record<string, unknown>[] | undefined) ?? [];
    const text = children.map((s) => spanToMarkdown(s, markDefs)).join("");
    const listItem = block.listItem as string | undefined;
    const style = block.style as string | undefined;

    if (listItem === "bullet") return `- ${text}`;
    if (listItem === "number") return `1. ${text}`;
    switch (style) {
      case "h1":
        return `# ${text}`;
      case "h2":
        return `## ${text}`;
      case "h3":
        return `### ${text}`;
      case "h4":
        return `#### ${text}`;
      case "h5":
        return `##### ${text}`;
      case "h6":
        return `###### ${text}`;
      case "blockquote":
        return `> ${text}`;
      default:
        return text;
    }
  }

  if (type === "image") {
    const asset = block.asset as { url?: string } | undefined;
    const alt = (block.alt as string | undefined) ?? "";
    if (!asset?.url) return "";
    return `![${alt}](${asset.url})`;
  }

  // Unknown block type — log it once so a new inline module isn't
  // silently stripped from the markdown export the next time someone
  // adds one to `blockContent.ts`.
  if (type) {
    logger.warn("portable-to-markdown: skipping unknown block type", { type });
  }
  return "";
}

function spanToMarkdown(
  span: Record<string, unknown>,
  markDefs: Record<string, unknown>[],
): string {
  if (span._type !== "span") return "";
  let text = (span.text as string | undefined) ?? "";
  const marks = (span.marks as string[] | undefined) ?? [];

  for (const mark of marks) {
    if (mark === "strong") text = `**${text}**`;
    else if (mark === "em") text = `_${text}_`;
    else if (mark === "code") text = `\`${text}\``;
    else {
      const def = markDefs.find((m) => m._key === mark);
      if (def?._type === "link") {
        const href = def.href as string | undefined;
        if (href) text = `[${text}](${href})`;
      }
    }
  }

  return text;
}
