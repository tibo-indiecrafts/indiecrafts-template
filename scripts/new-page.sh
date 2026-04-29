#!/usr/bin/env bash
set -euo pipefail

# ─── new-page.sh ──────────────────────────────────────────────────────────
# Scaffolds a new page co-located with its route in src/app/[locale]/.
#
# Creates:
#   src/app/[locale]/<segment>/page.tsx
#   src/app/[locale]/<segment>/page.config.ts
#   src/app/[locale]/<segment>/messages/{en,fr}.json
#
# Prints the three follow-up edits you still need to make by hand
# (routes.types.ts, src/config/pages/index.ts, src/config/pages/messages.ts)
# — these touch centralized files and would be brittle to patch with sed.
#
# Usage:  pnpm new:page <id> [url-segment]
#   pnpm new:page contact                # id and segment both "contact"
#   pnpm new:page contact nous-contacter # id "contact", URL "/nous-contacter"

ID="${1:-}"
SEGMENT="${2:-$ID}"

if [[ -z "$ID" ]]; then
  echo "Usage: pnpm new:page <id> [url-segment]" >&2
  exit 1
fi

if [[ ! "$ID" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "id must be lowercase letters, digits, and hyphens (got: $ID)" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ROUTE_DIR="$ROOT/src/app/[locale]/$SEGMENT"
MSG_DIR="$ROUTE_DIR/messages"

if [[ -d "$ROUTE_DIR" ]]; then
  echo "Route '$SEGMENT' already exists at $ROUTE_DIR — aborting." >&2
  exit 1
fi

mkdir -p "$MSG_DIR"

KEY="/$SEGMENT"
# Home-page special case: key "/" regardless of segment.
if [[ "$ID" == "home" ]]; then KEY="/"; fi

# ── page.config.ts ───────────────────────────────────────────────────────
cat >"$ROUTE_DIR/page.config.ts" <<EOF
import { definePage } from "@/config/pages/types";

export default definePage({
  key: "$KEY",
  id: "$ID",
  slugs: "/$SEGMENT",
  layout: "default",
  seo: {
    titleKey: "pages.$ID.title",
    descriptionKey: "pages.$ID.description",
  },
  sections: [
    {
      type: "hero",
      id: "$ID-hero",
      titleKey: "pages.$ID.hero.title",
      subtitleKey: "pages.$ID.hero.subtitle",
    },
  ],
});
EOF

# ── messages/{en,fr}.json ────────────────────────────────────────────────
cat >"$MSG_DIR/en.json" <<EOF
{
  "title": "$(echo "$ID" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')",
  "description": "TODO — write a 1-sentence description.",
  "hero": {
    "title": "TODO — hero title",
    "subtitle": "TODO — hero subtitle"
  }
}
EOF

cat >"$MSG_DIR/fr.json" <<EOF
{
  "title": "TODO",
  "description": "TODO — écrire une description d'une phrase.",
  "hero": {
    "title": "TODO — titre héros",
    "subtitle": "TODO — sous-titre héros"
  }
}
EOF

# ── route file ───────────────────────────────────────────────────────────
cat >"$ROUTE_DIR/page.tsx" <<EOF
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import ${ID}Page from "./page.config";
import { isPageVisible } from "@/config/features.config";
import type { Locale } from "@/config/locales.config";
import { buildMetadata } from "@/lib/metadata";
import { PageRenderer } from "@/sections/PageRenderer";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: ${ID}Page, locale });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(${ID}Page)) notFound();
  setRequestLocale(locale);
  return <PageRenderer page={${ID}Page} />;
}
EOF

echo ""
echo "✓ Created src/app/[locale]/$SEGMENT/page.config.ts"
echo "✓ Created src/app/[locale]/$SEGMENT/messages/{en,fr}.json"
echo "✓ Created src/app/[locale]/$SEGMENT/page.tsx"
echo ""
echo "Now make these three edits to register the page:"
echo ""
echo "  1. src/config/routes.types.ts"
echo "     Add \"$KEY\" to StaticAppPathname union."
echo ""
echo "  2. src/config/pages/index.ts"
echo "     import ${ID}Page from \"@/app/[locale]/$SEGMENT/page.config\";"
echo "     Append to PAGES and to PATHNAMES object."
echo ""
echo "  3. src/config/pages/messages.ts"
echo "     import ${ID}En from \"@/app/[locale]/$SEGMENT/messages/en.json\";"
echo "     import ${ID}Fr from \"@/app/[locale]/$SEGMENT/messages/fr.json\";"
echo "     Add { $ID: { en: ${ID}En, fr: ${ID}Fr } } to PAGE_MESSAGES."
echo ""
echo "Then run pnpm verify:pages to sanity-check."
