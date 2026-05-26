import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = imageUrlBuilder({ projectId, dataset });

/** Sanity image URL builder — chain .width(), .height(), .auto("format") etc. */
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
