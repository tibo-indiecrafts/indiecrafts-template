import type { ReactNode } from "react";
import { ChartMiniIllustration } from "@/components/ui-illustrations/chart-mini-illustration";
import { FingerprintCardIllustration } from "@/components/ui-illustrations/fingerprint-card-illustration";
import { MemoryUsageIllustration } from "@/components/ui-illustrations/memory-usage-illustration";
import { MessageChatIllustration } from "@/components/ui-illustrations/message-chat-illustration";
import { PollIllustration } from "@/components/ui-illustrations/poll-illustration";
import { UptimeIllustration } from "@/components/ui-illustrations/uptime-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { bento09Namespace } from "./config";
import type { BentoBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento09Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
        <div className="*:hover:bg-foreground/2 grid divide-y overflow-hidden rounded-2xl border [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] [--color-card:color-mix(in_oklab,var(--color-muted)15%,var(--color-background))] *:grid *:grid-rows-[1fr_auto] *:p-8 @2xl:grid-cols-2 @2xl:divide-x @4xl:grid-cols-3 @2xl:*:[:nth-child(2)]:border-r-0 @4xl:*:[:nth-child(2)]:border-r @4xl:*:[:nth-child(3)]:border-r-0 @2xl:*:[:nth-child(4)]:border-r-0 @4xl:*:[:nth-child(4)]:border-r @4xl:*:[:nth-child(4)]:border-b-0 @2xl:*:[:nth-child(5)]:border-b-0">
          <div className="space-y-8">
            <FingerprintCardIllustration />
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.identityCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.identityCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div aria-hidden>
              <ChartMiniIllustration />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.analyticsCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.analyticsCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div aria-hidden>
              <MemoryUsageIllustration borderPosition="bottom" />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.resourcesCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.resourcesCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div aria-hidden className="flex flex-col justify-center">
              <UptimeIllustration />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.reliabilityCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.reliabilityCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div aria-hidden>
              <PollIllustration />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.feedbackCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.feedbackCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div aria-hidden className="flex flex-col justify-center">
              <MessageChatIllustration />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.communicationCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.communicationCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
