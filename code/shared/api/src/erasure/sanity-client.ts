import type { SanityErasureClient } from "./sanity";

// Real SanityErasureClient over the Sanity HTTP API (the bare Worker can't use
// next-sanity/writeClient — server-only). Read via /data/query (GROQ), write via
// /data/mutate. Read token optional; write token required for pseudonymise.
export function createRealSanityClient(cfg: {
  projectId: string;
  dataset: string;
  apiVersion: string;
  writeToken: string;
  readToken?: string;
}): SanityErasureClient {
  const base = `https://${cfg.projectId}.api.sanity.io/v${cfg.apiVersion}/data`;
  return {
    async findByEmail(type, email) {
      const groq = `*[_type == $type && email == $email]{ _id }`;
      const url =
        `${base}/query/${cfg.dataset}?query=${encodeURIComponent(groq)}` +
        `&$type=${encodeURIComponent(JSON.stringify(type))}` +
        `&$email=${encodeURIComponent(JSON.stringify(email.toLowerCase().trim()))}`;
      const res = await fetch(url, {
        headers: cfg.readToken
          ? { authorization: `Bearer ${cfg.readToken}` }
          : {},
      });
      if (!res.ok) throw new Error(`sanity query ${res.status}`);
      const body = (await res.json()) as { result?: Array<{ _id: string }> };
      return body.result ?? [];
    },
    async pseudonymise(id, patch) {
      const res = await fetch(`${base}/mutate/${cfg.dataset}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${cfg.writeToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ mutations: [{ patch: { id, set: patch } }] }),
      });
      if (!res.ok) throw new Error(`sanity mutate ${res.status}`);
    },
  };
}
