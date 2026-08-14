import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext → Cloudflare Workers adapter. Mirror the web app's config if this app
// needs ISR/R2 caching (`incrementalCache`); the default is fine to start.
export default defineCloudflareConfig();
