/**
 * Block key — kebab-case identifier under which the form's own labels
 * resolve. The form is owned by the molecule (its labels live here),
 * so consumers don't have to wire the strings themselves.
 */
export const enterpriseFormKey = "enterprise-form" as const;
export const enterpriseFormNamespace = "blocks.enterprise-form" as const;

/** Privacy policy link target inside the consent line. */
export const enterpriseFormPrivacyHref = "#" as const;
