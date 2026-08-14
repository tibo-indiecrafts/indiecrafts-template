/**
 * Sanity Studio configuration — embedded Studio at /studio.
 *
 * This file is a thin **composer**: each owner (the shared-schema brick, the app
 * core, each module) exports a `SanityModule` contribution, and `composeStudio`
 * merges them into **one hub Studio** whose desk is **grouped per app** — "Site
 * web" (this app's content) vs "Contenu partagé" (site-wide config every app/lens
 * reads). One dataset, one editing surface. See `docs/apps/web/config/multi-app.md`.
 */

import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "@indiecrafts/sanity/env";
import { composeStudio } from "@indiecrafts/sanity/module";
import { locales } from "@indiecrafts/config";
import { sharedSanity } from "@indiecrafts/schema";
import { emailSanity, sendTestEmailAction } from "@indiecrafts/email/sanity";
import { blogSanity } from "@indiecrafts/blog/sanity";
import { newsletterSanity } from "@indiecrafts/newsletter/sanity";
import { waitlistSanity } from "@indiecrafts/waitlist/sanity";
import { consentSanity } from "@indiecrafts/consent/sanity";
import { coreSanity, homeSanity } from "./src/sanity";

// Per-app desk groups. "Site web" = this app's own content (home + the feature
// modules); "Contenu partagé" = site-wide config read by every app (SEO/nav/legal/
// UI messages via `coreSanity`, cookies/consent, and the composed E-mails entity).
// `sharedSanity` registers objects only (no desk). `emailSanity(all)` builds the
// one E-mails singleton from every module's `emailGroups`.
const appModules = [homeSanity, blogSanity, newsletterSanity, waitlistSanity];
const sharedModules = [coreSanity, consentSanity, sharedSanity];
const allModules = [...appModules, ...sharedModules];
const sanity = composeStudio([
  { title: "Site web", modules: appModules },
  { title: "Contenu partagé", modules: [...sharedModules, emailSanity(allModules)] },
]);

export default defineConfig({
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: {
    types: sanity.schemaTypes,
    templates: () => sanity.templates,
  },
  // "Envoyer un test" on the E-mails singleton — sends a sample of every enabled
  // email so an editor can verify deliverability. Owned by `@indiecrafts/email`.
  document: {
    actions: (prev, ctx) =>
      ctx.schemaType === "emailStrings" ? [...prev, sendTestEmailAction] : prev,
  },
  plugins: [
    structureTool({ structure: sanity.structure }),
    // Links each localized document to its translations (a `translation.metadata`
    // doc per translation set) so the Studio can create/jump between languages and
    // the front-end can resolve a doc's slug in another locale.
    documentInternationalization({
      // Derived from the app's single locale source (`@indiecrafts/config`) so
      // Studio and the front-end can never disagree on which languages exist.
      supportedLanguages: locales.map(({ code, label }) => ({ id: code, title: label })),
      schemaTypes: sanity.i18nSchemaTypes,
      languageField: "language",
      metadataOmnisearchVisibility: false,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
