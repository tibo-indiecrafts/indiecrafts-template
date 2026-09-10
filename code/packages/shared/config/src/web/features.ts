/**
 * The feature-flag **shape** — values stay per-app (each surface enables a
 * different subset), but every surface's `features` object types against this,
 * so modules can constrain the slice they need and a second app has a typed
 * baseline instead of an ad-hoc `as const`.
 */

/** A single flag: on/off. */
export type FeatureValue = boolean;

/** A feature map — flat flags or nested groups (e.g. `blog.comments`). */
export type FeatureMap = { readonly [key: string]: FeatureValue | FeatureMap };

/** Identity helper that pins a surface's flags to {@link FeatureMap} while keeping the literal type. */
export const defineFeatures = <T extends FeatureMap>(features: T): T =>
  features;
