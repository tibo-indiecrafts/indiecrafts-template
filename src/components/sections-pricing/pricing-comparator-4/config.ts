import type { PricingBlock } from "./schema";

export const pricingComparator4Key = "pricing-comparator-4" as const;
export const pricingComparator4Namespace = "blocks.pricing-comparator-4" as const;

export const pricingComparator4Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-comparator-4",
  titleKey: "blocks.pricing-comparator-4.title",
  bodyKey: "blocks.pricing-comparator-4.body",
  tiers: [
    {
      id: "basic",
      nameKey: "blocks.pricing-comparator-4.tiers.basicName",
      priceKey: "blocks.pricing-comparator-4.tiers.basicPrice",
      periodKey: "blocks.pricing-comparator-4.period",
      cta: { labelKey: "blocks.pricing-comparator-4.tiers.basicCta", href: "#" },
    },
    {
      id: "pro",
      nameKey: "blocks.pricing-comparator-4.tiers.proName",
      priceKey: "blocks.pricing-comparator-4.tiers.proPrice",
      periodKey: "blocks.pricing-comparator-4.period",
      cta: { labelKey: "blocks.pricing-comparator-4.tiers.proCta", href: "#" },
      highlighted: true,
    },
    {
      id: "team",
      nameKey: "blocks.pricing-comparator-4.tiers.teamName",
      priceKey: "blocks.pricing-comparator-4.tiers.teamPrice",
      periodKey: "blocks.pricing-comparator-4.period",
      cta: { labelKey: "blocks.pricing-comparator-4.tiers.teamCta", href: "#" },
    },
  ],
  features: [
    { id: "integrations", labelKey: "blocks.pricing-comparator-4.features.integrations" },
    { id: "apiCalls", labelKey: "blocks.pricing-comparator-4.features.apiCalls" },
    { id: "teamMembers", labelKey: "blocks.pricing-comparator-4.features.teamMembers" },
    { id: "support", labelKey: "blocks.pricing-comparator-4.features.support" },
    { id: "analytics", labelKey: "blocks.pricing-comparator-4.features.analytics" },
    { id: "webhooks", labelKey: "blocks.pricing-comparator-4.features.webhooks" },
    { id: "sso", labelKey: "blocks.pricing-comparator-4.features.sso" },
    { id: "auditLogs", labelKey: "blocks.pricing-comparator-4.features.auditLogs" },
  ],
  values: {
    integrations: {
      basic: { labelKey: "blocks.pricing-comparator-4.values.integrationsBasic" },
      pro: { labelKey: "blocks.pricing-comparator-4.values.integrationsPro" },
      team: { labelKey: "blocks.pricing-comparator-4.values.integrationsTeam" },
    },
    apiCalls: {
      basic: { labelKey: "blocks.pricing-comparator-4.values.apiCallsBasic" },
      pro: { labelKey: "blocks.pricing-comparator-4.values.apiCallsPro" },
      team: { labelKey: "blocks.pricing-comparator-4.values.apiCallsTeam" },
    },
    teamMembers: {
      basic: { labelKey: "blocks.pricing-comparator-4.values.teamMembersBasic" },
      pro: { labelKey: "blocks.pricing-comparator-4.values.teamMembersPro" },
      team: { labelKey: "blocks.pricing-comparator-4.values.teamMembersTeam" },
    },
    support: {
      basic: { labelKey: "blocks.pricing-comparator-4.values.supportBasic" },
      pro: { labelKey: "blocks.pricing-comparator-4.values.supportPro" },
      team: { labelKey: "blocks.pricing-comparator-4.values.supportTeam" },
    },
    analytics: { basic: true, pro: true, team: true },
    webhooks: { basic: false, pro: true, team: true },
    sso: { basic: false, pro: false, team: true },
    auditLogs: { basic: false, pro: false, team: true },
  },
};
