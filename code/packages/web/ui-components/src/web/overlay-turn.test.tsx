import { afterEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { useOverlayTurn, type OverlayKey } from "./overlay-turn";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Wish = { id: OverlayKey; wants: boolean };

function Overlay({ id, wants }: Wish) {
  return useOverlayTurn(id, wants) ? <p>{id}</p> : null;
}

const el = document.createElement("div");
let root: Root | null = null;

/** Render the overlays (re-rendering the same root keeps their state) → the visible ids. */
async function render(overlays: Wish[]) {
  root ??= createRoot(el);
  await act(async () =>
    root!.render(overlays.map((o) => <Overlay key={o.id} {...o} />)),
  );
  return el.textContent;
}

afterEach(async () => {
  await act(async () => root?.unmount());
  root = null;
});

describe("useOverlayTurn", () => {
  it("shows a lone overlay that wants to show", async () => {
    expect(await render([{ id: "legal", wants: true }])).toBe("legal");
  });

  it("shows nothing when no overlay wants to show", async () => {
    expect(await render([{ id: "legal", wants: false }])).toBe("");
  });

  it("shows only the highest-priority overlay: consent, then legal, then promotions", async () => {
    expect(
      await render([
        { id: "announcement", wants: true },
        { id: "legal", wants: true },
        { id: "consent", wants: true },
      ]),
    ).toBe("consent");
  });

  it("hands the turn to the next overlay once the current one is done", async () => {
    await render([
      { id: "consent", wants: true },
      { id: "legal", wants: true },
    ]);
    expect(
      await render([
        { id: "consent", wants: false },
        { id: "legal", wants: true },
      ]),
    ).toBe("legal");
  });

  it("renders only the head of the queue (consent) on the server", () => {
    expect(renderToString(<Overlay id="legal" wants />)).toBe("");
    expect(
      renderToString(
        <>
          <Overlay id="consent" wants />
          <Overlay id="legal" wants />
        </>,
      ),
    ).toBe("<p>consent</p>");
  });
});
