import { describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LegalReacceptancePrompt } from "./LegalReacceptancePrompt";

const props = {
  message: "We updated our [[Privacy Policy]] and [[Terms]].",
  hrefs: ["https://site.test/privacy", "https://site.test/terms"],
  acceptLabel: "Accept",
  onAccept: () => {},
};

describe("LegalReacceptancePrompt", () => {
  it("renders the website banner: one sentence + Accept, centered, in the bottom slot clear of the home indicator", () => {
    const html = renderToStaticMarkup(<LegalReacceptancePrompt {...props} />);
    expect(html).toContain('role="status"');
    expect(html).toContain("max-w-md");
    expect(html).toContain("mx-auto");
    expect(html).toContain("bottom-safe-4");
    expect(html).not.toContain("font-semibold"); // no title line
    expect(html).toContain(">Accept<");
  });

  it("links open in a new tab by default", () => {
    const html = renderToStaticMarkup(<LegalReacceptancePrompt {...props} />);
    expect(html).toContain(
      '<a href="https://site.test/privacy" target="_blank" rel="noreferrer"',
    );
  });

  it("uses the caller's link component", () => {
    const Link = ({
      href,
      children,
    }: {
      href: string;
      children: ReactNode;
    }) => (
      <a href={href} data-locale-link="">
        {children}
      </a>
    );
    const html = renderToStaticMarkup(
      <LegalReacceptancePrompt {...props} link={Link} />,
    );
    expect(html).toContain('data-locale-link=""');
  });
});
