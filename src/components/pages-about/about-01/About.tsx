import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Content01Section } from "@/components/sections-content/content-01";
import { Team01Section } from "@/components/sections-team/team-01";
import { Faq01Section } from "@/components/sections-faq/faq-01";
import { CallToActionSection } from "@/components/sections-cta/cta-01";
import { content01Sample } from "@/components/sections-content/content-01/config";
import { team01Sample } from "@/components/sections-team/team-01/config";
import { faq01Sample } from "@/components/sections-faq/faq-01/config";
import { cta01Sample } from "@/components/sections-cta/cta-01/config";
import { about01Defaults, about01Namespace } from "./config";

export type AboutProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export function About({
  layout = about01Defaults.layout,
  header,
  footer,
}: AboutProps = {}) {
  const t = useTranslations(about01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <Content01Section {...content01Sample} id={about01Defaults.sectionIds.content} />
      <Team01Section {...team01Sample} id={about01Defaults.sectionIds.team} />
      <Faq01Section {...faq01Sample} id={about01Defaults.sectionIds.faq} />
      <CallToActionSection {...cta01Sample} id={about01Defaults.sectionIds.cta} />
    </Layout>
  );
}
