import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

/**
 * Site settings — a single, language-independent singleton (`_id: siteSettings`)
 * for the "fill-once" SEO data: social profiles, the schema.org business type
 * (Organization / LocalBusiness subtype) with its address / contact / geo
 * fields, and any extra global JSON-LD entities.
 *
 * SOLE runtime source for these (no `@/config` fallback) — read by
 * `getSiteSettings` (`src/lib/seo/site-seo.ts`) and fed to `buildSiteSchemas`
 * (`src/lib/seo/jsonld-core.ts`). Per-language SEO text lives in the separate
 * per-locale `siteMeta` singleton.
 */
const BUSINESS_TYPES = [
  "Organization",
  "LocalBusiness",
  "ProfessionalService",
  "HomeAndConstructionBusiness",
  "LegalService",
  "MedicalBusiness",
  "FinancialService",
  "Store",
  "Restaurant",
  "FoodEstablishment",
] as const;

export default defineType({
  name: "siteSettings",
  title: "Paramètres du site (SEO)",
  type: "document",
  icon: CogIcon,
  __experimental_omnisearch_visibility: false,
  groups: [
    { name: "brand", title: "Logo & icônes", default: true },
    { name: "social", title: "Réseaux sociaux" },
    { name: "business", title: "Votre activité" },
    { name: "schemas", title: "Infos Google en plus" },
    { name: "indexing", title: "Indexation" },
    { name: "verification", title: "Vérification Google / Bing" },
  ],
  fields: [
    // ── Logo & icons ───────────────────────────────────────────
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "brand",
      description:
        "Le logo affiché dans l'en-tête et le pied de page. Vide = le nom du site s'affiche en texte.",
      fields: [defineField({ name: "alt", title: "Texte alternatif", type: "string" })],
    }),
    defineField({
      name: "logoDark",
      title: "Logo pour fond sombre (optionnel)",
      type: "image",
      group: "brand",
      description:
        "Version du logo utilisée quand le site est en mode sombre. Vide = le logo principal est utilisé partout.",
      fields: [defineField({ name: "alt", title: "Texte alternatif", type: "string" })],
    }),
    defineField({
      name: "icon",
      title: "Icône du site (favicon)",
      type: "image",
      group: "brand",
      description:
        "La petite icône dans l'onglet du navigateur et sur l'écran d'accueil. Image carrée, au moins 512×512.",
      fields: [defineField({ name: "alt", title: "Texte alternatif", type: "string" })],
    }),

    // ── Social profiles ────────────────────────────────────────
    defineField({
      name: "social",
      title: "Profils sociaux",
      type: "object",
      group: "social",
      description: "URL complète, ou vide pour masquer.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "twitter", title: "Twitter / X (@handle)", type: "string" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "github", title: "GitHub", type: "url" }),
        defineField({ name: "mastodon", title: "Mastodon", type: "url" }),
      ],
    }),

    // ── Business entity / structured data ──────────────────────
    defineField({
      name: "businessType",
      title: "Type d'activité",
      type: "string",
      group: "business",
      description:
        "« Organization » convient à la plupart des sites. Choisissez un type de commerce local (restaurant, boutique…) pour activer les champs adresse, horaires et zone desservie ci-dessous.",
      options: {
        list: BUSINESS_TYPES.map((t) => ({ title: t, value: t })),
      },
      initialValue: "Organization",
    }),
    defineField({
      name: "company",
      title: "Raison sociale",
      type: "string",
      group: "business",
    }),
    defineField({
      name: "legalName",
      title: "Dénomination légale",
      type: "string",
      group: "business",
      description: "Nom juridique complet, si différent de la raison sociale.",
    }),
    defineField({
      name: "alternateName",
      title: "Autre nom / sigle",
      type: "string",
      group: "business",
      description: "Nom alternatif ou acronyme connu de la marque.",
    }),
    defineField({
      name: "foundingDate",
      title: "Date de création",
      type: "string",
      group: "business",
      description: "Année de création, ex. « 2019 ». Vide = non affiché.",
    }),
    defineField({
      name: "address",
      title: "Adresse postale",
      type: "object",
      group: "business",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "streetAddress", title: "Rue", type: "string" }),
        defineField({ name: "addressLocality", title: "Ville", type: "string" }),
        defineField({ name: "addressRegion", title: "Région", type: "string" }),
        defineField({ name: "postalCode", title: "Code postal", type: "string" }),
        defineField({ name: "addressCountry", title: "Pays", type: "string" }),
      ],
    }),
    defineField({
      name: "contactPoint",
      title: "Point de contact",
      type: "object",
      group: "business",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "telephone", title: "Téléphone", type: "string" }),
        defineField({ name: "email", title: "E-mail", type: "string" }),
        defineField({
          name: "contactType",
          title: "Type",
          type: "string",
          initialValue: "customer service",
        }),
      ],
    }),
    defineField({
      name: "geo",
      title: "Coordonnées GPS",
      type: "object",
      group: "business",
      description: "Pour une activité avec une adresse physique. Vide = non affiché.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "latitude", title: "Latitude", type: "string" }),
        defineField({ name: "longitude", title: "Longitude", type: "string" }),
      ],
    }),
    defineField({
      name: "priceRange",
      title: "Gamme de prix",
      type: "string",
      group: "business",
      description: "Indication de prix, ex. « €€ ». Vide = non affiché.",
    }),
    defineField({
      name: "openingHours",
      title: "Horaires d'ouverture",
      type: "array",
      group: "business",
      of: [{ type: "string" }],
      description:
        "Une ligne par plage, format « Mo-Fr 09:00-18:00 » (jours en anglais : Mo Tu We Th Fr Sa Su).",
    }),
    defineField({
      name: "areaServed",
      title: "Zones desservies",
      type: "array",
      group: "business",
      of: [{ type: "string" }],
      description:
        "Villes ou régions où vous intervenez, une par ligne. Ex. « Grenoble ».",
    }),

    // ── Site-wide indexing ─────────────────────────────────────
    defineField({
      name: "robots",
      title: "Indexation du site",
      type: "object",
      group: "indexing",
      description:
        "Contrôle tout le site d'un coup — pratique pour un site en préparation. Vide = le site est indexé normalement.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "noindex",
          title: "Cacher tout le site des moteurs de recherche",
          type: "boolean",
          description:
            "Activé, aucune page n'apparaît dans Google / Bing (balise noindex partout).",
          initialValue: false,
        }),
        defineField({
          name: "nofollow",
          title: "Ne pas suivre les liens du site",
          type: "boolean",
          description:
            "Activé, les moteurs ne suivent pas les liens (balise nofollow partout).",
          initialValue: false,
        }),
      ],
    }),

    // ── Search-engine verification ─────────────────────────────
    defineField({
      name: "verification",
      title: "Codes de vérification",
      type: "object",
      group: "verification",
      description:
        "Codes fournis par Google Search Console / Bing pour prouver que le site vous appartient. Vide = non utilisé.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "google", title: "Google", type: "string" }),
        defineField({ name: "bing", title: "Bing", type: "string" }),
      ],
    }),

    // ── Extra global schemas ───────────────────────────────────
    defineField({
      name: "globalSchemas",
      title: "Informations Google en plus",
      type: "array",
      group: "schemas",
      of: [{ type: "globalSchema" }],
      description:
        "Informations que Google peut mettre en avant sur tout le site : un service, un produit, une personne ou un événement.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Paramètres du site (SEO)" }),
  },
});
