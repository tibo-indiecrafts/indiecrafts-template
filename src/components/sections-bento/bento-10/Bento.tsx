import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { CampaignCardIllustration } from "@/components/ui-illustrations/campaign-card-illustration";
import { ChartMiniIllustration } from "@/components/ui-illustrations/chart-mini-illustration";
import { FingerprintCardIllustration } from "@/components/ui-illustrations/fingerprint-card-illustration";
import { KitStackIllustration } from "@/components/ui-illustrations/kit-stack-illustration";
import { MemoryUsageIllustration } from "@/components/ui-illustrations/memory-usage-illustration";
import { MessageChatIllustration } from "@/components/ui-illustrations/message-chat-illustration";
import { UptimeIllustration } from "@/components/ui-illustrations/uptime-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { bento10Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento10Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
        <div className="relative">
          <PlusDecorator className="-translate-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 translate-x-[calc(50%-0.5px)] -translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="right-0 bottom-0 translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <PlusDecorator className="bottom-0 -translate-x-[calc(50%-0.5px)] translate-y-[calc(50%-0.5px)]" />
          <div className="*:hover:bg-foreground/2 grid divide-y overflow-hidden border [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] [--color-card:color-mix(in_oklab,var(--color-muted)15%,var(--color-background))] *:grid *:grid-rows-[1fr_auto] *:p-8 @2xl:grid-cols-2 @2xl:divide-x @4xl:grid-cols-3 @4xl:grid-rows-[auto_1fr_auto] @2xl:*:[:nth-child(2)]:border-r-0 @4xl:*:[:nth-child(2)]:border-r @4xl:*:[:nth-child(3)]:border-r-0 @2xl:*:[:nth-child(4)]:border-r-0 @4xl:*:[:nth-child(4)]:border-r @4xl:*:[:nth-child(4)]:border-b-0 @2xl:*:[:nth-child(5)]:border-r-0 @4xl:*:[:nth-child(6)]:border-b-0">
            <div className="space-y-8">
              <div aria-hidden className="flex flex-col justify-center">
                <MessageChatIllustration />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.messagingCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot(props.messagingCell.bodyKey)}
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
                  {tRoot(props.analyticsCell.bodyKey)}
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
                  {tRoot(props.resourcesCell.bodyKey)}
                </p>
              </div>
            </div>

            <div className="@4xl:row-span-2">
              <div aria-hidden className="flex flex-col justify-center">
                <KitStackIllustration />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.kitCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot(props.kitCell.bodyKey)}
                </p>
              </div>
            </div>

            <div className="relative grid gap-8 @2xl:col-span-2 @2xl:grid-cols-2 @2xl:!pb-0">
              <PlusDecorator className="hidden -translate-[calc(50%+0.5px)] @4xl:block" />
              <div aria-hidden className="@2xl:pr-4">
                <CampaignCardIllustration />
              </div>
              <div className="flex flex-col justify-between gap-8 @2xl:pl-4">
                <div>
                  <h3 className="text-foreground font-semibold">
                    {tRoot(props.communicationCell.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-balance">
                    {tRoot(props.communicationCell.bodyKey)}
                  </p>
                </div>
                <blockquote className="before:bg-primary relative max-w-xl pl-4 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:rounded-full">
                  <p className="text-muted-foreground text-base">
                    {tRoot(props.communicationCell.quoteKey)}
                  </p>
                  <footer className="mt-4 flex items-center gap-2">
                    <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                      <AvatarImage src={props.communicationCell.authorAvatarUrl} alt="" />
                      <AvatarFallback>
                        {tRoot(props.communicationCell.authorNameKey).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <cite>{tRoot(props.communicationCell.authorNameKey)}</cite>
                  </footer>
                </blockquote>
              </div>
            </div>

            <div className="space-y-8">
              <div aria-hidden>
                <FingerprintCardIllustration />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.identityCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot(props.identityCell.bodyKey)}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div aria-hidden className="flex flex-col justify-center">
                <UptimeIllustration />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.uptimeCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot(props.uptimeCell.bodyKey)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlusDecorator({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "before:bg-foreground/25 after:bg-foreground/25 absolute size-3 mask-radial-from-15% before:absolute before:inset-0 before:m-auto before:h-px after:absolute after:inset-0 after:m-auto after:w-px",
        className,
      )}
    />
  );
}
