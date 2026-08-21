/**
 * Default shell copy for the status pages, per locale — the ONE source the
 * non-CMS shells (mobile · hybrid) render, so their 404/500 wording never drifts
 * apart. The web `website` owns its copy in Sanity (editor-editable) + its own
 * `messages`, so it does NOT read this — this is the static default for the shells.
 *
 * Same ICU shape as the apps' `messages/*.json`; a shell merges it under its own
 * local keys (`home`/`app`) then formats with `react-intl`.
 */
import type {
  NotFoundContentProps,
  ErrorContentProps,
  OfflineContentProps,
} from "./types";

export type ShellCopy = {
  notFound: NotFoundContentProps;
  error: Omit<ErrorContentProps, "onRetry">;
  offline: Omit<OfflineContentProps, "onRetry"> & { banner: string };
};

export const SHELL_COPY: Record<string, ShellCopy> = {
  en: {
    notFound: {
      eyebrow: "404",
      title: "Page not found",
      description: "This page doesn't exist or has moved.",
      homeLabel: "Go home",
    },
    error: {
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
      retryLabel: "Try again",
    },
    offline: {
      banner: "You're offline — some features may be unavailable.",
      title: "You're offline",
      description: "Check your connection and try again.",
      retryLabel: "Try again",
    },
  },
  fr: {
    notFound: {
      eyebrow: "404",
      title: "Page introuvable",
      description: "Cette page n'existe pas ou a été déplacée.",
      homeLabel: "Accueil",
    },
    error: {
      title: "Une erreur est survenue",
      description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      retryLabel: "Réessayer",
    },
    offline: {
      banner: "Vous êtes hors ligne — certaines fonctions peuvent être indisponibles.",
      title: "Vous êtes hors ligne",
      description: "Vérifiez votre connexion, puis réessayez.",
      retryLabel: "Réessayer",
    },
  },
};
