/**
 * Sanity Studio configuration — embedded Studio at /studio.
 *
 * This file is a thin **composer**: each owner (the shared-schema brick, the app
 * core, each module) exports a `SanityModule` contribution, and `composeStudio`
 * merges them into **one hub Studio** whose desk is **grouped per app** — "Site
 * web" (this app's content) vs "Contenu partagé" (site-wide config every app/lens
 * reads). One dataset, one editing surface. See `code/docs/shared/architecture/multi-app.md`.
 */

import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineLocations, presentationTool } from "sanity/presentation";
import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
} from "@indiecrafts/packages-web-sanity/env";
import { composeStudio } from "@indiecrafts/packages-web-sanity/module";
import { locales } from "@indiecrafts/packages-shared-config";
import { features } from "./src/config";
import { sharedSanity } from "@indiecrafts/packages-web-schema";
import {
  emailSanity,
  sendTestEmailAction,
  buildClerkEmails,
  clerkEmailsStructureItem,
  securityAlertGroups,
  emailPreferencesSchema,
  emailPreferencesStructureItem,
} from "@indiecrafts/packages-web-email/sanity";
import { pageBuilderSanity } from "@indiecrafts/packages-web-page-builder/sanity";
import { blogSanity } from "@indiecrafts/modules-web-blog/sanity";
import { newsletterSanity } from "@indiecrafts/modules-web-newsletter/sanity";
import { waitlistSanity } from "@indiecrafts/modules-web-waitlist/sanity";
import { contactSanity } from "@indiecrafts/modules-web-contact/sanity";
import { complianceSanity } from "@indiecrafts/packages-web-compliance/sanity";
import { announcementSanity } from "@indiecrafts/packages-web-announcement/sanity";
import { localeSuggestSanity } from "@indiecrafts/packages-web-locale-suggest/sanity";
import { coreSanity } from "./src/sanity";
import { appContentSchema, appContentStructureItem } from "./src/sanity/app-content";

// Per-app desk groups. "Site web" = this app's own content (home + the feature
// modules); "Contenu partagé" = site-wide config read by every app (SEO/nav/legal/
// UI messages via `coreSanity`, cookies/consent, and the composed E-mails entity).
// `sharedSanity` registers objects only (no desk). `emailSanity(all)` builds the
// one E-mails singleton from every module's `emailGroups`.
const previewOrigins = (process.env.SANITY_STUDIO_PREVIEW_ORIGINS ?? "")
  .split(",")
  .filter(Boolean);

const appModules = [
  pageBuilderSanity,
  blogSanity,
  newsletterSanity(features.newsletter),
  waitlistSanity(features.waitlist),
  contactSanity(features.contact),
];
const sharedModules = [
  coreSanity,
  complianceSanity,
  announcementSanity,
  localeSuggestSanity,
  sharedSanity,
];
const allModules = [...appModules, ...sharedModules];
const sanity = composeStudio([
  { title: "Site web", modules: appModules },
  {
    title: "Contenu partagé",
    // The auth emails and the internal security alert have no feature module of their own;
    // they contribute their groups to the same E-mails singleton via bare `{ emailGroups }`
    // entries. `emailPreferences` is likewise a bare singleton with no feature module of
    // its own — its schema + desk item are added directly here.
    modules: [
      ...sharedModules,
      {
        name: "email-preferences",
        schemaTypes: [emailPreferencesSchema],
        structure: (S) => [emailPreferencesStructureItem(S)],
      },
      // The `appContent` welcome singleton — read live by the app surface.
      {
        name: "app-content",
        schemaTypes: [appContentSchema],
        structure: (S) => [appContentStructureItem(S)],
      },
      // The `clerkEmails` singleton — the editable copy for every Clerk auth/security
      // email the api worker takes over (separate from the "E-mails" singleton).
      {
        name: "clerk-emails",
        schemaTypes: [buildClerkEmails()],
        structure: (S) => [clerkEmailsStructureItem(S)],
      },
      emailSanity([...allModules, { emailGroups: [...securityAlertGroups] }]),
    ],
  },
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
  // email so an editor can verify deliverability. Owned by `@indiecrafts/packages-web-email`.
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
      // Derived from the app's single locale source (`@indiecrafts/packages-shared-config`) so
      // Studio and the front-end can never disagree on which languages exist.
      supportedLanguages: locales.map(({ code, label }) => ({ id: code, title: label })),
      schemaTypes: sanity.i18nSchemaTypes,
      languageField: "language",
      metadataOmnisearchVisibility: false,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    // "Aperçu" (the Presentation tool): the site in an iframe, in draft mode, with click-to-edit. It opens a
    // preview session through `/api/draft-mode/enable` (needs `SANITY_API_READ_TOKEN`).
    presentationTool({
      title: "Aperçu",
      // Hosted Studio (`*.sanity.studio`): `sanity.cli.ts` passes the deployed sites —
      // open the first, switch to the others from the address bar. Embedded (`/studio`):
      // unset, so the preview is this same site.
      ...(previewOrigins.length ? { allowOrigins: previewOrigins } : {}),
      previewUrl: {
        ...(previewOrigins.length ? { initial: previewOrigins[0] } : {}),
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        locations: {
          post: defineLocations({
            select: { title: "title", slug: "media.slug.current", language: "language" },
            resolve: (doc) =>
              doc?.slug
                ? {
                    locations: [
                      {
                        title: doc.title ?? doc.slug,
                        href: `/${doc.language}/blog/${doc.slug}`,
                      },
                    ],
                  }
                : null,
          }),
        },
      },
    }),
  ],
});
