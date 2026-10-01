"use client";
/**
 * Run the scripts of an editor-authored HTML embed under the strict nonce CSP.
 *
 * @see docs/reference/packages/web/ui-components/src/web/content/EmbedScripts.md
 */
import { useEffect } from "react";
import type { EmbedScript } from "./split-scripts";

// A `src` script with one of these types fetches and fires load/error; others never do.
const RUNNABLE_TYPE = /^(module|(text|application)\/(java|ecma)script)$/i;

/**
 * The nonce the document's CSP enforces — read from a server-rendered script (the `nonce`
 * attribute is hidden after parsing, the `.nonce` property is not). Never a per-request
 * value: the proxy mints a fresh nonce for every RSC refresh, which the page rejects.
 * `undefined` without a CSP nonce (Storybook, tests).
 */
export function documentNonce(): string | undefined {
  const el = document.querySelector<HTMLScriptElement>("script[nonce]");
  return el?.nonce || el?.getAttribute("nonce") || undefined;
}

/**
 * Insert each script, in order, with the nonce. An external script is awaited (load or
 * error) before the next, so the common "load the library, then call it" snippet works;
 * one that will never load (`nomodule`, a non-JS `type`) is not awaited. Inline `on*`
 * handlers are dropped — they can't take a nonce — and so is any attribute name the DOM
 * rejects. An aborted `signal` (the block unmounted) stops before the next insert.
 * Resolves to a cleanup that removes the inserted elements.
 */
export async function runScripts(
  scripts: EmbedScript[],
  nonce: string | undefined,
  parent: HTMLElement,
  signal?: AbortSignal,
): Promise<() => void> {
  const added: HTMLScriptElement[] = [];
  const cleanup = () => added.forEach((el) => el.remove());
  for (const { attrs, code } of scripts) {
    if (signal?.aborted) break;
    const el = document.createElement("script");
    for (const [name, value] of Object.entries(attrs)) {
      if (name.startsWith("on")) continue;
      try {
        el.setAttribute(name, value === true ? "" : value);
      } catch {
        // an invalid attribute name pasted by an editor — skip it, keep the script
      }
    }
    if (nonce) el.nonce = nonce;
    el.async = false;
    if (!attrs.src) el.textContent = code;
    const type = typeof attrs.type === "string" ? attrs.type : "";
    const loads =
      Boolean(attrs.src) &&
      !attrs.nomodule &&
      (!type || RUNNABLE_TYPE.test(type));
    const settled = loads
      ? new Promise<void>((resolve) => {
          el.addEventListener("load", () => resolve(), { once: true });
          el.addEventListener("error", () => resolve(), { once: true });
          signal?.addEventListener("abort", () => resolve(), { once: true });
        })
      : null;
    parent.append(el);
    added.push(el);
    if (settled) await settled;
  }
  return cleanup;
}

/**
 * A Custom HTML block's scripts. Runs them on every mount — the first load and each
 * client navigation back to the block, like a full page load would — so a widget that
 * renders into the block's markup finds it. `'strict-dynamic'` trusts what they load.
 */
export function EmbedScripts({ scripts }: { scripts: EmbedScript[] }) {
  // Keyed on content, not identity: a server refresh (Sanity Live) sends an equal but new
  // array, which must not re-run the widget.
  const key = JSON.stringify(scripts);
  useEffect(() => {
    const parsed = JSON.parse(key) as EmbedScript[];
    if (parsed.length === 0) return;
    const abort = new AbortController();
    let cleanup: (() => void) | undefined;
    runScripts(parsed, documentNonce(), document.body, abort.signal)
      .then((undo) => {
        if (abort.signal.aborted) undo();
        else cleanup = undo;
      })
      .catch(() => {
        // best effort — a broken embed must never break the page
      });
    return () => {
      abort.abort();
      cleanup?.();
    };
  }, [key]);
  return null;
}
