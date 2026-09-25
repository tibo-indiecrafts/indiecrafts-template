/**
 * Defines the language-independent site settings singleton schema.
 *
 * @see docs/reference/projects/web/website/src/sanity/schema/site-settings.md
 */
import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

/**
 * Site settings — a single, language-independent singleton (`_id: siteSettings`)
 * for the "fill-once" SEO data: social profiles, the schema.org business type
 * (Organization / LocalBusiness subtype) with its address / contact / geo
 * fields, and any extra global JSON-LD entities.
 *
 * SOLE runtime source for these (no `@indiecrafts/packages-shared-config` fallback) — read by
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
    { name: "display", title: "Affichage & thème" },
    { name: "verification", title: "Vérification Google / Bing" },
    { name: "analytics", title: "Analytics & cookies" },
    { name: "share", title: "Partage" },
  ],
  fields: [
    // ── Identity ───────────────────────────────────────────────
    defineField({
      name: "siteName",
      title: "Nom du site",
      type: "string",
      group: "business",
      description:
        "Le nom de la marque affiché dans l'onglet du navigateur, les titres de page et les partages. Ex. « indiecrafts.dev ».",
    }),

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
      description:
        "Vos profils sur les réseaux. Chacun apparaît en icône dans le pied de page (bloc « Nous suivre ») et confirme à Google que ce compte est le vôtre. Vide = l'icône n'apparaît pas.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "twitter",
          title: "X / Twitter",
          type: "string",
          description: "Votre identifiant avec le @, ex. « @indiecrafts ».",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
          description:
            "Adresse complète du profil ou de la page, ex. « https://linkedin.com/company/… ».",
        }),
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
          description: "Adresse complète du profil, ex. « https://instagram.com/… ».",
        }),
        defineField({
          name: "github",
          title: "GitHub",
          type: "url",
          description:
            "Adresse complète du profil ou de l'organisation, ex. « https://github.com/… ».",
        }),
        defineField({
          name: "mastodon",
          title: "Mastodon",
          type: "url",
          description: "Adresse complète du profil, ex. « https://mastodon.social/@… ».",
        }),
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
      name: "maintenanceMode",
      title: "Mode maintenance",
      type: "boolean",
      group: "indexing",
      description:
        "Activé, tout le site affiche une page « en maintenance » (erreur 503) — sauf le Studio. Se déclenche en moins d'une minute, sans redéploiement. Laissez désactivé en fonctionnement normal.",
      initialValue: false,
    }),
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

    // ── Analytics & cookies ────────────────────────────────────
    defineField({
      name: "analytics",
      title: "Analytics & cookies",
      type: "object",
      group: "analytics",
      description:
        "Mesure d'audience Google Analytics et bannière de consentement aux cookies.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "googleAnalyticsId",
          title: "Identifiant Google Analytics",
          type: "string",
          description:
            "Votre identifiant de mesure GA4, ex. « G-XXXXXXXXXX ». Vide = aucun suivi (aucun script chargé).",
        }),
        defineField({
          name: "requireCookieConsent",
          title: "Demander le consentement aux cookies",
          type: "boolean",
          description:
            "Activé, une bannière s'affiche et rien n'est mesuré tant que le visiteur n'a pas accepté (obligatoire pour le trafic UE / RGPD). Désactivé, la mesure démarre immédiatement.",
          initialValue: false,
        }),
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

    // ── Rich-result image (site-wide default) ──────────────────
    defineField({
      name: "schemaImage",
      title: "Image pour les résultats Google (par défaut)",
      type: "image",
      group: "schemas",
      description:
        "L'image que Google peut afficher à côté d'un résultat, pour tout le site. Vide = l'image de partage de chaque page est utilisée. Une page peut la remplacer dans ses métadonnées.",
      options: { hotspot: true },
    }),

    // ── Display & theme ────────────────────────────────────────
    defineField({
      name: "themeModes",
      title: "Modes de thème (clair / sombre)",
      type: "object",
      group: "display",
      description:
        "Quels thèmes de couleur le site propose. Vide = clair + sombre (le réglage par défaut). Quand les deux sont proposés, le site adopte automatiquement le thème de l'appareil au premier chargement.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "light",
          title: "Proposer le thème clair",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "dark",
          title: "Proposer le thème sombre",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "forced",
          title: "Forcer un seul thème",
          type: "string",
          description:
            "Verrouille tout le site sur un thème et masque le bouton de changement. « Aucun » = le visiteur choisit.",
          options: {
            list: [
              { title: "Aucun (le visiteur choisit)", value: "none" },
              { title: "Toujours clair", value: "light" },
              { title: "Toujours sombre", value: "dark" },
            ],
          },
          initialValue: "none",
        }),
      ],
    }),
    defineField({
      name: "showLocaleSwitcher",
      title: "Afficher le sélecteur de langue",
      type: "boolean",
      group: "display",
      description:
        "Décoche pour masquer le sélecteur de langue dans l'en-tête. (Sans effet si le site n'a qu'une langue.)",
      initialValue: true,
    }),
    defineField({
      name: "showStructuredData",
      title: "Activer les données structurées (JSON-LD)",
      type: "boolean",
      group: "display",
      description:
        "Les balises que Google lit pour les résultats enrichis. Décoche pour tout désactiver (rare — réduit la visibilité).",
      initialValue: true,
    }),
    defineField({
      name: "showFaq",
      title: "Activer la FAQ enrichie (Google)",
      type: "boolean",
      group: "display",
      description:
        "Émet le balisage FAQ que Google peut afficher. Décoche pour le retirer sans masquer la FAQ visible sur la page.",
      initialValue: true,
    }),

    // ── Share buttons (site-wide: footer + posts) ──────────────
    defineField({
      name: "share",
      title: "Boutons de partage",
      type: "object",
      group: "share",
      description:
        "La rangée de partage affichée dans le pied de page et sous chaque article (X, LinkedIn, Facebook, copier le lien).",
      options: { columns: 2 },
      fields: [
        defineField({
          name: "enabled",
          title: "Afficher les boutons de partage",
          type: "boolean",
          description:
            "Décoche pour masquer le partage partout (pied de page et articles). Vide = affiché.",
          initialValue: true,
        }),
        defineField({
          name: "x",
          title: "X (Twitter)",
          type: "boolean",
          description: "Vide = affiché.",
          initialValue: true,
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "boolean",
          description: "Vide = affiché.",
          initialValue: true,
        }),
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "boolean",
          description: "Vide = affiché.",
          initialValue: true,
        }),
        defineField({
          name: "copyLink",
          title: "Copier le lien",
          type: "boolean",
          description: "Le bouton « copier le lien ». Vide = affiché.",
          initialValue: true,
        }),
      ],
    }),

    // ── Footer maker credit ────────────────────────────────────
    defineField({
      name: "madeBy",
      title: "Crédit du créateur (pied de page)",
      type: "object",
      group: "brand",
      description:
        "La mention « conçu par » dans le pied de page, avec un aperçu au survol. Vide = aucun crédit affiché.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "name", title: "Nom", type: "string" }),
        defineField({ name: "href", title: "Lien", type: "url" }),
        defineField({
          name: "domain",
          title: "Domaine affiché",
          type: "string",
          description: "Ex. « indiecrafts.dev ».",
        }),
        defineField({
          name: "image",
          title: "Image d'aperçu (URL)",
          type: "url",
          description: "L'image montrée dans l'aperçu au survol du lien.",
        }),
        defineField({ name: "title", title: "Titre de l'aperçu", type: "string" }),
        defineField({
          name: "description",
          title: "Description de l'aperçu",
          type: "text",
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Paramètres du site (SEO)" }),
  },
});
