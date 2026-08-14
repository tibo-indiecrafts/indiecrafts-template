/**
 * Sanity Studio configuration — embedded Studio at /studio.
 *
 * This file is a thin **composer**: each owner (the shared-schema brick, the app
 * core, each module) exports a `SanityModule` contribution — its schema, desk
 * section, create templates, and i18n types — and `composeSanity` merges them.
 * Adding or removing a module is **one line in the array below**, not surgery
 * across four hardcoded lists. See `@indiecrafts/sanity/module`.
 */

import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "@indiecrafts/sanity/env";
import { composeSanity } from "@indiecrafts/sanity/module";
import { locales } from "@indiecrafts/config";
import { sharedSanity } from "@indiecrafts/schema";
import { emailSanity, sendTestEmailAction } from "@indiecrafts/email/sanity";
import { blogSanity } from "@indiecrafts/blog/sanity";
import { newsletterSanity } from "@indiecrafts/newsletter/sanity";
import { waitlistSanity } from "@indiecrafts/waitlist/sanity";
import { consentSanity } from "@indiecrafts/consent/sanity";
import { coreSanity } from "./src/sanity";

// Order = desk order. `sharedSanity` contributes only objects (no desk section);
// add a new module's contribution here (blog → shop → events …) and nothing else.
// `emailSanity(modules)` builds the one "E-mails" singleton from every module's
// `emailGroups` (order = module order), so its fields track this list too.
const modules = [
  sharedSanity,
  blogSanity,
  newsletterSanity,
  waitlistSanity,
  coreSanity,
  consentSanity,
];
const sanity = composeSanity([...modules, emailSanity(modules)]);

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
