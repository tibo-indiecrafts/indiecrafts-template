import { describe, expect, it } from "vitest";
import { parseVideoEmbed } from "./video-embed";

describe("parseVideoEmbed", () => {
  it("parses a standard YouTube watch URL", () => {
    const r = parseVideoEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(r).toMatchObject({ kind: "youtube", id: "dQw4w9WgXcQ" });
    expect(r?.embedSrc).toMatch(/^https:\/\//);
    expect(r?.embedSrc).toContain("dQw4w9WgXcQ");
  });

  it("parses youtu.be, /embed/, and -nocookie hosts", () => {
    expect(parseVideoEmbed("https://youtu.be/dQw4w9WgXcQ")).toMatchObject({
      kind: "youtube",
      id: "dQw4w9WgXcQ",
    });
    expect(
      parseVideoEmbed("https://www.youtube.com/embed/dQw4w9WgXcQ"),
    ).toMatchObject({ kind: "youtube" });
    expect(
      parseVideoEmbed("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"),
    ).toMatchObject({ kind: "youtube" });
  });

  it("parses Vimeo, Dailymotion (incl. dai.ly + _title), and direct files", () => {
    expect(parseVideoEmbed("https://vimeo.com/123456789")).toMatchObject({
      kind: "vimeo",
      id: "123456789",
    });
    expect(
      parseVideoEmbed("https://www.dailymotion.com/video/x8abcde_my-title"),
    ).toMatchObject({ kind: "dailymotion", id: "x8abcde" });
    expect(parseVideoEmbed("https://dai.ly/x8abcde")).toMatchObject({
      kind: "dailymotion",
      id: "x8abcde",
    });
    expect(parseVideoEmbed("https://cdn.example.com/clip.mp4")).toMatchObject({
      kind: "file",
    });
  });

  it("rejects non-http protocols, unknown hosts, malformed ids, and empty input", () => {
    expect(parseVideoEmbed("javascript:alert(1)")).toBeNull();
    expect(parseVideoEmbed("data:text/html,<script>")).toBeNull();
    expect(parseVideoEmbed("https://evil.example.com/watch?v=x")).toBeNull();
    expect(
      parseVideoEmbed("https://www.youtube.com/watch?v=tooShort"),
    ).toBeNull();
    expect(parseVideoEmbed("https://vimeo.com/not-a-number")).toBeNull();
    expect(parseVideoEmbed("")).toBeNull();
    expect(parseVideoEmbed(null)).toBeNull();
    expect(parseVideoEmbed(undefined)).toBeNull();
  });
});
