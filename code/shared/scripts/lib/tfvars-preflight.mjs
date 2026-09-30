// tfvars preflight — what a stack × env still needs before a REAL Terraform run.
// The committed tfvars are per-client placeholders (blank ids, `example.com` hosts), so a
// plan/apply against them fails deep inside the provider, or worse, targets a domain you
// don't own. This reads one `env/<env>.tfvars` and returns the problems in plain words.
// Used by `infra/run.mjs` (one stack) and `infra/all.mjs` (every stack), before any call.

const HEX32 = /^[0-9a-f]{32}$/;

/** @param {string} tfvars the file's text @returns {string[]} problems (empty = ready) */
export function preflight(tfvars) {
  const val = (k) =>
    tfvars
      .match(
        new RegExp(`^\\s*${k}\\s*=\\s*"?([^"#\\n]*?)"?\\s*(?:#.*)?$`, "m"),
      )?.[1]
      ?.trim();
  const out = [];
  if (!HEX32.test(val("account_id") ?? ""))
    out.push(
      "account_id is blank — the Cloudflare account id (dashboard → any zone → right sidebar)",
    );
  if (val("attach_domain") === "true") {
    if (!HEX32.test(val("zone_id") ?? ""))
      out.push(
        "zone_id is blank — the Zone ID of the domain's zone (zone Overview → right sidebar)",
      );
    const domain = val("domain") ?? "";
    if (!domain) out.push("domain is blank — the host this env serves");
    else if (/(^|\.)example\.com$/.test(domain))
      out.push(
        `domain "${domain}" is the template placeholder — set your real host (or attach_domain = false)`,
      );
  }
  return out;
}
