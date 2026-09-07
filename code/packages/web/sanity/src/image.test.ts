import { describe, expect, it } from "vitest";
import { sanityImageLoader } from "./image";

describe("sanityImageLoader", () => {
  it("passes through local/relative paths and data URIs unchanged", () => {
    expect(sanityImageLoader({ src: "/brand/logo.png", width: 400 })).toBe(
      "/brand/logo.png",
    );
    expect(
      sanityImageLoader({ src: "data:image/png;base64,AAAA", width: 400 }),
    ).toBe("data:image/png;base64,AAAA");
  });

  it("passes through a src that already has a query string", () => {
    const src = "https://cdn.sanity.io/images/proj/ds/abc-800x600.jpg?w=100";
    expect(sanityImageLoader({ src, width: 400 })).toBe(src);
  });

  it("never resizes an .svg on a resize-capable host", () => {
    const src = "https://cdn.sanity.io/images/proj/ds/logo.svg";
    expect(sanityImageLoader({ src, width: 400 })).toBe(src);
  });

  it("appends resize params for cdn.sanity.io and images.unsplash.com", () => {
    expect(
      sanityImageLoader({
        src: "https://cdn.sanity.io/images/proj/ds/abc-800x600.jpg",
        width: 400,
        quality: 80,
      }),
    ).toBe(
      "https://cdn.sanity.io/images/proj/ds/abc-800x600.jpg?w=400&q=80&auto=format&fit=max",
    );
    expect(
      sanityImageLoader({
        src: "https://images.unsplash.com/photo-123",
        width: 200,
        quality: 60,
      }),
    ).toBe(
      "https://images.unsplash.com/photo-123?w=200&q=60&auto=format&fit=max",
    );
  });

  it("defaults quality to 75 when omitted", () => {
    expect(
      sanityImageLoader({
        src: "https://cdn.sanity.io/images/proj/ds/abc.jpg",
        width: 300,
      }),
    ).toBe(
      "https://cdn.sanity.io/images/proj/ds/abc.jpg?w=300&q=75&auto=format&fit=max",
    );
  });

  it("passes through non-CDN absolute URLs unchanged", () => {
    const src = "https://example.com/photo.jpg";
    expect(sanityImageLoader({ src, width: 400 })).toBe(src);
  });
});
