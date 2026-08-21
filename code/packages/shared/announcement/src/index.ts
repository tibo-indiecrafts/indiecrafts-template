/**
 * `@indiecrafts/packages-shared-announcement` — the portable announcement core.
 * Types + the single resolve path + the GROQ strings, React/Next-free so both the
 * Next server readers and the bare `code/shared/api` Worker import the SAME logic.
 * The web presentation (schema, `AnnouncementBar`, `AnnouncementToast`) lives in
 * `@indiecrafts/packages-web-announcement`.
 */

export {
  SURFACES,
  type Surface,
  type AnnouncementLink,
  type BannerItem,
  type Banner,
  type Toast,
  type AnnouncementPayload,
  type RawLocaleString,
  type RawLink,
  type RawBannerItem,
  type RawBanner,
  type RawToast,
} from "./types";
export { resolveBanner, resolveToast } from "./resolve";
export { bannerQuery, toastQuery } from "./queries";
export { fetchAnnouncements } from "./client";
