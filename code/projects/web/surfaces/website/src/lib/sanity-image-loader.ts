/**
 * Re-export the shared Sanity next/image loader for `images.loaderFile`.
 *
 * @see docs/reference/projects/web/website/src/lib/sanity-image-loader.md
 */
// `next.config` `images.loaderFile` needs an in-app module whose default export
// is the loader. The implementation lives in the shared package so the CDN-param
// logic has one home; this is just the wiring shim.
export { default } from "@indiecrafts/packages-web-sanity/image";
