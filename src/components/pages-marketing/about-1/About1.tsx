import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Content1Section } from "@/components/sections-marketing-content/content-1";
import { Team1Section } from "@/components/sections-marketing-team/team-1";
import { Faq1Section } from "@/components/sections-marketing-faq/faq-1";
import { CallToActionSection } from "@/components/sections-marketing-cta/cta-1";
import { content1Sample } from "@/components/sections-marketing-content/content-1/config";
import { team1Sample } from "@/components/sections-marketing-team/team-1/config";
import { faq1Sample } from "@/components/sections-marketing-faq/faq-1/config";
import { cta1Sample } from "@/components/sections-marketing-cta/cta-1/config";
import { about1Defaults, about1Namespace } from "./config";

export type About1Props = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

/**
 * Marketing about template — content → team → faq → cta. Section copy
 * comes from each section's `<type>Sample`; page-scoped strings live in
 * `./en.json` under `blocks.about-1.*`.
 */
export function About1({
  layout = about1Defaults.layout,
  header,
  footer,
}: About1Props = {}) {
  const t = useTranslations(about1Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Content1Section {...content1Sample} id={about1Defaults.sectionIds.content} />
      <Team1Section {...team1Sample} id={about1Defaults.sectionIds.team} />
      <Faq1Section {...faq1Sample} id={about1Defaults.sectionIds.faq} />
      <CallToActionSection {...cta1Sample} id={about1Defaults.sectionIds.cta} />
    </Layout>
  );
}
