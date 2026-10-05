import { describe, expect, it } from "vitest";
import { parseVideoEmbed } from "@indiecrafts/packages-shared-utils/video-embed";
import { iframeSrc } from "./FeaturedMedia";

describe("iframeSrc — no tracking cookies from embeds", () => {
  it("Vimeo plays with do-not-track", () => {
    const src = iframeSrc(
      parseVideoEmbed("https://vimeo.com/76979871")!,
      false,
      true,
    );
    expect(new URL(src).searchParams.get("dnt")).toBe("1");
  });

  it("YouTube plays from the no-cookie domain", () => {
    const src = iframeSrc(
      parseVideoEmbed("https://youtu.be/dQw4w9WgXcQ")!,
      false,
      true,
    );
    expect(new URL(src).hostname).toBe("www.youtube-nocookie.com");
  });
});
