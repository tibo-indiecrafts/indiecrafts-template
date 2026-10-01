"use client";
/**
 * Run the scripts of an editor-authored HTML embed under the strict nonce CSP.
 *
 * @see docs/reference/packages/web/ui-components/src/web/content/EmbedScripts.md
 */
import { useEffect } from "react";
import type { EmbedScript } from "./split-scripts";
import { useNonce } from "./nonce";

/**
 * Insert each script, in order, with the nonce. An external script is awaited (load or
 * error) before the next one, so the common "load the library, then call it" snippet
 * works. Inline `on*` handler attributes are dropped — they can't take a nonce. Resolves
 * to a cleanup that removes the inserted elements.
 */
export async function runScripts(
  scripts: EmbedScript[],
  nonce: string | undefined,
  parent: HTMLElement,
): Promise<() => void> {
  const added: HTMLScriptElement[] = [];
  for (const { attrs, code } of scripts) {
    const el = document.createElement("script");
    for (const [name, value] of Object.entries(attrs))
      if (!name.startsWith("on"))
        el.setAttribute(name, value === true ? "" : value);
    if (nonce) el.nonce = nonce;
    el.async = false;
    if (!attrs.src) el.textContent = code;
    const settled = attrs.src
      ? new Promise<void>((resolve) => {
          el.addEventListener("load", () => resolve(), { once: true });
          el.addEventListener("error", () => resolve(), { once: true });
        })
      : null;
    parent.append(el);
    added.push(el);
    if (settled) await settled;
  }
  return () => added.forEach((el) => el.remove());
}

/**
 * A Custom HTML block's scripts. Runs them on every mount — the first load and each
 * client navigation back to the block, like a full page load would — so a widget that
 * renders into the block's markup finds it. `'strict-dynamic'` trusts what they load.
 */
export function EmbedScripts({ scripts }: { scripts: EmbedScript[] }) {
  const nonce = useNonce();
  // Keyed on content, not identity: a server refresh (Sanity Live) sends an equal but new
  // array, which must not re-run the widget.
  const key = JSON.stringify(scripts);
  useEffect(() => {
    const scripts = JSON.parse(key) as EmbedScript[];
    if (scripts.length === 0) return;
    let cleanup: (() => void) | undefined;
    let gone = false;
    void runScripts(scripts, nonce, document.body).then((undo) => {
      if (gone) undo();
      else cleanup = undo;
    });
    return () => {
      gone = true;
      cleanup?.();
    };
  }, [key, nonce]);
  return null;
}
