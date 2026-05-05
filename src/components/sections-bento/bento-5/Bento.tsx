import { Card } from "@/components/ui-primitives/card";
import { CampaignIllustration } from "@/components/ui-illustrations/campaign-illustration";
import { ChartIllustration } from "@/components/ui-illustrations/chart-illustration";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { FingerprintScanIllustration } from "@/components/ui-illustrations/fingerprint-scan-illustration";
import { KeysIllustration } from "@/components/ui-illustrations/keys-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { bento5Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento5Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-10">
          <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 @4xl:col-span-4">
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.keysCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.keysCell.bodyKey)}
              </p>
            </div>
            <KeysIllustration />
          </Card>

          <Card className="grid grid-rows-[auto_1fr] gap-8 rounded-2xl p-8 [--color-background:var(--color-muted)] @xl:col-span-2 @4xl:col-span-6">
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.chartCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.chartCell.bodyKey)}
              </p>
            </div>
            <div className="relative">
              <ChartIllustration />
            </div>
          </Card>

          <Card className="group grid grid-rows-[1fr_auto] gap-8 overflow-hidden rounded-2xl p-8 @4xl:col-span-3">
            <FingerprintScanIllustration />
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.fingerprintCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.fingerprintCell.bodyKey)}
              </p>
            </div>
          </Card>

          <Card className="group grid grid-rows-[1fr_auto] gap-8 overflow-hidden rounded-2xl p-8 [--color-background:var(--color-muted)] @4xl:col-span-4">
            <CampaignIllustration />
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.campaignCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.campaignCell.bodyKey)}
              </p>
            </div>
          </Card>

          <Card className="row-start-1 grid grid-rows-[1fr_auto] gap-8 overflow-hidden rounded-2xl p-8 @4xl:col-span-3 @4xl:row-start-auto">
            <div className="grid h-fit grid-cols-3 gap-3 **:mt-0">
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.docsCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.docsCell.bodyKey)}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
