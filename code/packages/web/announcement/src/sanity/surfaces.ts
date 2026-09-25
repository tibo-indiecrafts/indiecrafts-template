/**
 * Defines the shared per-surface targeting field.
 *
 * @see docs/reference/packages/web/announcement/src/sanity/surfaces.md
 */

import { defineField } from "sanity";
import {
  SURFACES,
  type Surface,
} from "@indiecrafts/packages-shared-announcement";

/**
 * Per-surface targeting field — reused by the bar AND the toast. The option VALUES
 * come from the shared `SURFACES` list so the Studio choices can never drift from the
 * resolver. Empty = every surface (the resolver treats an empty list as "all").
 */
const SURFACE_TITLES: Record<Surface, string> = {
  website: "Site web",
  app: "Application web",
  mobile: "Application mobile",
};

export const surfacesField = defineField({
  name: "surfaces",
  title: "Surfaces concernées",
  type: "array",
  of: [{ type: "string" }],
  options: {
    list: SURFACES.map((value) => ({ value, title: SURFACE_TITLES[value] })),
    layout: "grid",
  },
  description:
    "Où afficher cette annonce. Vide = partout (site web, application web, mobile).",
});
