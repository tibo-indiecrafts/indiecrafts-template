import type { ReactNode } from "react";
import { Card } from "@/components/ui-primitives/card";
import { AiMemoryIllustration } from "@/components/ui-illustrations/ai-memory-illustration";
import { CampaignIllustration } from "@/components/ui-illustrations/campaign-illustration";
import { ChartMediumIllustration } from "@/components/ui-illustrations/chart-medium-illustration";
import { FingerprintCardIllustration } from "@/components/ui-illustrations/fingerprint-card-illustration";
import { MessageChatIllustration } from "@/components/ui-illustrations/message-chat-illustration";
import { ModelsRowIllustration } from "@/components/ui-illustrations/models-row-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { bento08Namespace } from "./config";
import type { BentoBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento08Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
        <div className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3 @4xl:grid-rows-2">
          <div className="row-span-2 grid grid-rows-[auto_1fr] gap-4">
            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.smartHomeCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot.rich(props.smartHomeCell.bodyKey, RICH_STRONG)}
                </p>
              </div>
              <div className="-mx-8 overflow-hidden">
                <AiMemoryIllustration />
              </div>
            </Card>
            <Card className="group grid grid-cols-[auto_1fr] gap-6 overflow-hidden rounded-2xl p-8">
              <FingerprintCardIllustration />
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.biometricCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot(props.biometricCell.bodyKey)}
                </p>
              </div>
            </Card>
          </div>

          <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
            <div className="flex flex-col justify-end">
              <h3 className="text-foreground font-semibold">
                {tRoot(props.marketingCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.marketingCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <CampaignIllustration />
            </div>
          </Card>

          <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.messagingCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot(props.messagingCell.bodyKey)}
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <MessageChatIllustration />
            </div>
          </Card>

          <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.visualizationCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot(props.visualizationCell.bodyKey)}
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <ChartMediumIllustration />
            </div>
          </Card>

          <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.feedbackCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot(props.feedbackCell.bodyKey)}
              </p>
            </div>
            <div className="-mx-8 flex flex-col justify-end overflow-hidden">
              <ModelsRowIllustration />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
