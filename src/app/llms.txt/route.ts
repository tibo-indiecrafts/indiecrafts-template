/**
 * /llms.txt — a plain-text summary for LLM crawlers.
 * Spec: https://llmstxt.org
 *
 * Generated from config/llms.config.ts + messages/<locale>.json so it stays
 * in sync with the rest of the site. Served in the default locale; override
 * via `?locale=` query string.
 */

import { getTranslations } from "next-intl/server";
import { features } from "@/config/features.config";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale } from "@/config/locales.config";
import { llmsConfig } from "@/config/llms.config";
import { siteConfig } from "@/config/site.config";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(request: Request) {
  if (!features.llmsTxt) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const requested = url.searchParams.get("locale") ?? DEFAULT_LOCALE;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const t = await getTranslations({ locale, namespace: "llms" });

  const header = [
    `# ${siteConfig.name}`,
    ``,
    `> ${siteConfig.tagline}`,
    ``,
    `Site: ${siteConfig.url}`,
    `Languages: ${SUPPORTED_LOCALES.join(", ")}`,
    ``,
  ];

  const sectionBlocks = llmsConfig.sections.map((section) => {
    const title = section.key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const body = t(`sections.${section.bodyKey}`, {
      company: siteConfig.legal.company,
      tagline: siteConfig.tagline,
      email: siteConfig.contact.email ?? "",
    });
    return [`## ${title}`, ``, body, ``];
  });

  const resources = [
    `## Resources`,
    ``,
    ...llmsConfig.resourceLinks.map((link) => {
      const label = t(`resources.${link.labelKey}`);
      return `- [${label}](${siteConfig.url}${link.href})`;
    }),
    ``,
  ];

  const body = [...header, ...sectionBlocks.flat(), ...resources].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
