export * from "./token";

import { verifyDownloadToken } from "./token";

/**
 * Framework-agnostic route helper: verify a gated-delivery token, then resolve
 * the asset URL. The consumer injects everything — `resolveAssetUrl` looks the
 * `assetId` up wherever the asset lives (Sanity, R2, a signed CDN URL, …).
 *
 * Any failure — bad token or a resolver that returns no URL — is a 403, so the
 * caller never distinguishes "invalid link" from "unknown asset".
 */
export async function resolveGatedDownload(
  token: string,
  secret: string,
  resolveAssetUrl: (assetId: string) => Promise<string | null> | string | null,
  now?: number,
): Promise<{ ok: true; url: string } | { ok: false; status: 403 }> {
  const payload = await verifyDownloadToken(token, secret, now);
  if (!payload) return { ok: false, status: 403 };

  const url = await resolveAssetUrl(payload.assetId);
  if (!url) return { ok: false, status: 403 };

  return { ok: true, url };
}
