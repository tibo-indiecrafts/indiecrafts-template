import type { PricingBlock } from "./schema";

export const pricingComparator04Key = "pricing-comparator-04" as const;
export const pricingComparator04Namespace = "blocks.pricing-comparator-04" as const;

export const pricingComparator04Sample: Omit<PricingBlock, "id"> = {
  type: "pricing-comparator-04",
  titleKey: "blocks.pricing-comparator-04.title",
  bodyKey: "blocks.pricing-comparator-04.body",
  tiers: [
    {
      id: "basic",
      nameKey: "blocks.pricing-comparator-04.tiers.basicName",
      priceKey: "blocks.pricing-comparator-04.tiers.basicPrice",
      periodKey: "blocks.pricing-comparator-04.period",
      cta: { labelKey: "blocks.pricing-comparator-04.tiers.basicCta", href: "#" },
    },
    {
      id: "pro",
      nameKey: "blocks.pricing-comparator-04.tiers.proName",
      priceKey: "blocks.pricing-comparator-04.tiers.proPrice",
      periodKey: "blocks.pricing-comparator-04.period",
      cta: { labelKey: "blocks.pricing-comparator-04.tiers.proCta", href: "#" },
      highlighted: true,
    },
    {
      id: "team",
      nameKey: "blocks.pricing-comparator-04.tiers.teamName",
      priceKey: "blocks.pricing-comparator-04.tiers.teamPrice",
      periodKey: "blocks.pricing-comparator-04.period",
      cta: { labelKey: "blocks.pricing-comparator-04.tiers.teamCta", href: "#" },
    },
  ],
  features: [
    {
      id: "integrations",
      labelKey: "blocks.pricing-comparator-04.features.integrations",
    },
    { id: "apiCalls", labelKey: "blocks.pricing-comparator-04.features.apiCalls" },
    { id: "teamMembers", labelKey: "blocks.pricing-comparator-04.features.teamMembers" },
    { id: "support", labelKey: "blocks.pricing-comparator-04.features.support" },
    { id: "analytics", labelKey: "blocks.pricing-comparator-04.features.analytics" },
    { id: "webhooks", labelKey: "blocks.pricing-comparator-04.features.webhooks" },
    { id: "sso", labelKey: "blocks.pricing-comparator-04.features.sso" },
    { id: "auditLogs", labelKey: "blocks.pricing-comparator-04.features.auditLogs" },
  ],
  values: {
    integrations: {
      basic: { labelKey: "blocks.pricing-comparator-04.values.integrationsBasic" },
      pro: { labelKey: "blocks.pricing-comparator-04.values.integrationsPro" },
      team: { labelKey: "blocks.pricing-comparator-04.values.integrationsTeam" },
    },
    apiCalls: {
      basic: { labelKey: "blocks.pricing-comparator-04.values.apiCallsBasic" },
      pro: { labelKey: "blocks.pricing-comparator-04.values.apiCallsPro" },
      team: { labelKey: "blocks.pricing-comparator-04.values.apiCallsTeam" },
    },
    teamMembers: {
      basic: { labelKey: "blocks.pricing-comparator-04.values.teamMembersBasic" },
      pro: { labelKey: "blocks.pricing-comparator-04.values.teamMembersPro" },
      team: { labelKey: "blocks.pricing-comparator-04.values.teamMembersTeam" },
    },
    support: {
      basic: { labelKey: "blocks.pricing-comparator-04.values.supportBasic" },
      pro: { labelKey: "blocks.pricing-comparator-04.values.supportPro" },
      team: { labelKey: "blocks.pricing-comparator-04.values.supportTeam" },
    },
    analytics: { basic: true, pro: true, team: true },
    webhooks: { basic: false, pro: true, team: true },
    sso: { basic: false, pro: false, team: true },
    auditLogs: { basic: false, pro: false, team: true },
  },
};
