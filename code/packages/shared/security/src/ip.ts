/**
 * Client-IP helpers — validate + sanitize an address before it is trusted.
 *
 * Proxy headers (`x-forwarded-for` etc.) are attacker-controlled, so a value
 * read from them must be validated before it keys a rate-limiter, a log line,
 * or a store. Zero-dependency; safe in the Edge/Workers runtime.
 */

const OCTET = /^\d{1,3}$/;
const HEX_GROUP = /^[0-9a-fA-F]{1,4}$/;

function isValidIPv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  for (const part of parts) {
    if (!OCTET.test(part)) return false;
    const num = Number.parseInt(part, 10);
    if (num < 0 || num > 255) return false;
    // Reject leading zeros ("01") except "0" itself.
    if (part.length > 1 && part.startsWith("0")) return false;
  }
  return true;
}

function allHex(groups: string[]): boolean {
  return groups.every((g) => HEX_GROUP.test(g));
}

/** Validate an IPv6 in compressed form (contains "::"). */
function isValidCompressedIPv6(left: string[], right: string[]): boolean {
  const lastRight = right.at(-1);
  if (lastRight && lastRight.includes(".")) {
    if (!isValidIPv4(lastRight)) return false;
    // An embedded IPv4 consumes two of the eight groups.
    return (
      left.length + right.length <= 6 &&
      allHex(left) &&
      allHex(right.slice(0, -1))
    );
  }
  return left.length + right.length <= 7 && allHex(left) && allHex(right);
}

/** Validate an IPv6 in full 8-group form (no "::"). */
function isValidFullIPv6(groups: string[]): boolean {
  const last = groups[6];
  if (groups.length === 7 && last && last.includes(".")) {
    return isValidIPv4(last) && allHex(groups.slice(0, 6));
  }
  return groups.length === 8 && allHex(groups);
}

function isValidIPv6(ip: string): boolean {
  // Strip a zone id (e.g. fe80::1%eth0); the zone must be alphanumeric.
  const zoneIndex = ip.indexOf("%");
  const address = zoneIndex >= 0 ? ip.substring(0, zoneIndex) : ip;
  if (zoneIndex >= 0 && !/^[\da-zA-Z]+$/.test(ip.substring(zoneIndex + 1)))
    return false;

  // At most one "::".
  const halves = address.split("::");
  if (halves.length > 2) return false;

  if (halves.length === 2) {
    const [leftRaw, rightRaw] = halves;
    const left = leftRaw ? leftRaw.split(":") : [];
    const right = rightRaw ? rightRaw.split(":") : [];
    return isValidCompressedIPv6(left, right);
  }

  return isValidFullIPv6(address.split(":"));
}

/** True when `ip` is a syntactically valid IPv4 or IPv6 address. */
export function isValidIpAddress(ip: string): boolean {
  return isValidIPv4(ip) || isValidIPv6(ip);
}

/** Trim + validate an IP; returns the address or `null` when it is not valid. */
export function sanitizeIpAddress(
  ip: string | null | undefined,
): string | null {
  if (!ip || typeof ip !== "string") return null;
  const trimmed = ip.trim();
  return isValidIpAddress(trimmed) ? trimmed : null;
}

/**
 * First client IP from proxy headers, or "unknown". Reads `x-forwarded-for`
 * (first hop) then `x-real-ip`. The value is NOT validated here — pass it
 * through `sanitizeIpAddress` before trusting it.
 */
export function extractIpFromHeadersList(headersList: {
  get: (name: string) => string | null;
}): string {
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}
