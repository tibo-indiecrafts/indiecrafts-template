/**
 * Pull the configured brand logo (Sanity `siteSettings`) into the shell's service screens.
 *
 * @see docs/reference/projects/mobile/main/scripts/brand.md
 */
import { readFileSync, writeFileSync } from "node:fs";

/** The logo is configured once, in Sanity (`siteSettings.logo` / `logoDark`) — the same
 *  source the website reads. No static copy: the shell asks Sanity's image CDN for the
 *  exact images it needs (sized, padded, PNG), so no image tool is required. */
export const BRAND_QUERY =
  '*[_id == "siteSettings"][0]{ "logo": logo.asset->url, "logoDark": logoDark.asset->url }';

/** The logo takes this share of the VISIBLE short side of the splash. */
export const SPLASH_LOGO_SHARE = 0.18;
/** iOS fills a portrait phone from ONE square image (`scaleAspectFill`): only ~9/19.5 of its
 *  width shows. A square splash shrinks the logo by that much so it looks the same size. */
const SQUARE_VISIBLE = 9 / 19.5;

/** `{ logo, logoDark }` asset URLs from Sanity, or null (no config, no network, no logo).
 *  Never throws — a build without Sanity keeps the images it already has. */
export async function fetchBrand(
  { projectId, dataset, apiVersion = "2025-01-01" },
  f = fetch,
) {
  if (!projectId || !dataset) return null;
  try {
    const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(BRAND_QUERY)}`;
    const res = await f(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const result = (await res.json()).result;
    return result?.logo
      ? { logo: result.logo, logoDark: result.logoDark ?? null }
      : null;
  } catch {
    return null;
  }
}

/** The logo alone, for the offline page (2× a 64px slot). */
export const logoUrl = (asset) => `${asset}?w=128&h=128&fit=max&fm=png`;

/** A full splash: the logo centred on `bg`, exactly `w`×`h` (`fit=fill` + `pad`). */
export function splashUrl(asset, w, h, bg = "ffffff") {
  const share =
    w === h ? SPLASH_LOGO_SHARE * SQUARE_VISIBLE : SPLASH_LOGO_SHARE;
  const pad = Math.round((Math.min(w, h) * (1 - share)) / 2);
  return `${asset}?w=${w}&h=${h}&fit=fill&bg=${bg}&pad=${pad}&fm=png`;
}

/** Width × height from a PNG header. */
export function pngSize(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/** Download `url` into `file`; true on success. */
export async function download(url, file, f = fetch) {
  const res = await f(url, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) return false;
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return true;
}

/** Re-render every native splash image at its own size from `asset`. */
export async function renderSplashes(asset, files, f = fetch) {
  for (const file of files) {
    const { w, h } = pngSize(readFileSync(file));
    if (!(await download(splashUrl(asset, w, h), file, f)))
      throw new Error(`splash ${file}`);
  }
}
