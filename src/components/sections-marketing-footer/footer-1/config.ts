import type { Footer1Block } from "./schema";

/**
 * Default footer-1 instance. Customize the link groups + social hrefs per
 * client. The locale selector is intentionally NOT part of this block —
 * use `@/components/layout/LocaleSwitcher` elsewhere in the layout.
 */
export const footer1Sample: Omit<Footer1Block, "id"> = {
  type: "footer-1",
  groups: [
    {
      titleKey: "blocks.footer-1.groups.product.title",
      items: [
        { labelKey: "blocks.footer-1.groups.product.features", href: "#" },
        { labelKey: "blocks.footer-1.groups.product.pricing", href: "#" },
        { labelKey: "blocks.footer-1.groups.product.changelog", href: "#" },
      ],
    },
    {
      titleKey: "blocks.footer-1.groups.company.title",
      items: [
        { labelKey: "blocks.footer-1.groups.company.about", href: "#" },
        { labelKey: "blocks.footer-1.groups.company.careers", href: "#" },
        { labelKey: "blocks.footer-1.groups.company.contact", href: "#" },
      ],
    },
    {
      titleKey: "blocks.footer-1.groups.legal.title",
      items: [
        { labelKey: "blocks.footer-1.groups.legal.privacy", href: "#" },
        { labelKey: "blocks.footer-1.groups.legal.terms", href: "#" },
        { labelKey: "blocks.footer-1.groups.legal.cookies", href: "#" },
      ],
    },
  ],
  socials: [
    { platform: "twitter", href: "#" },
    { platform: "linkedin", href: "#" },
    { platform: "instagram", href: "#" },
  ],
  newsletter: {
    labelKey: "blocks.footer-1.newsletter.label",
    placeholderKey: "blocks.footer-1.newsletter.placeholder",
    submitKey: "blocks.footer-1.newsletter.submit",
    hintKey: "blocks.footer-1.newsletter.hint",
  },
  copyrightKey: "blocks.footer-1.copyright",
};
