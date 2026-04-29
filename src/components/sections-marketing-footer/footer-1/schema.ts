import type { MessageKey } from "@/types/messages";

export type FooterSocial =
  | "twitter"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "threads"
  | "tiktok";

export type FooterLink = {
  labelKey: MessageKey;
  /** Kept as string to allow external `http(s):` hrefs alongside internal paths. */
  href: string;
};

export type FooterGroup = {
  titleKey: MessageKey;
  items: FooterLink[];
};

export type Footer1Block = {
  type: "footer-1";
  id: string;
  groups: FooterGroup[];
  socials?: { platform: FooterSocial; href: string }[];
  newsletter?: {
    labelKey: MessageKey;
    placeholderKey: MessageKey;
    submitKey: MessageKey;
    hintKey: MessageKey;
  };
  copyrightKey: MessageKey;
};
