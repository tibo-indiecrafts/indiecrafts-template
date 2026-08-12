// `next.config` `images.loaderFile` needs an in-app module whose default export
// is the loader. The implementation lives in the shared package so the CDN-param
// logic has one home; this is just the wiring shim.
export { default } from "@indiecrafts/sanity/image";
