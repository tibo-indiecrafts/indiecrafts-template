import { ArrowBigRight, Equal } from "lucide-react";
import { Card } from "@/components/ui-primitives/card";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { IDCheckIllustration } from "@/components/ui-illustrations/id-check-illustration";
import { KeysIllustration } from "@/components/ui-illustrations/keys-illustration";
import { LeaderboardIsoIllustration } from "@/components/ui-illustrations/leaderboard-iso-illustration";
import { ReplyIllustration } from "@/components/ui-illustrations/reply-illustration";
import { SecurityShieldIsoIllustration } from "@/components/ui-illustrations/security-shield-iso-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { bento4Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento4Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>

      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        <div className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
          {/* Row 1 — three single-column cards */}
          <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
            <div className="relative flex flex-wrap items-center justify-between gap-1 from-transparent via-blue-50 to-indigo-50">
              <div className="mx-auto size-2/3">
                <SecurityShieldIsoIllustration />
              </div>
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.shieldCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.shieldCell.bodyKey)}
              </p>
            </div>
          </Card>

          <Card className="group grid grid-rows-[1fr_auto] gap-8 overflow-hidden rounded-2xl p-8">
            <KeysIllustration />
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.keysCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.keysCell.bodyKey)}
              </p>
            </div>
          </Card>

          <Card className="grid grid-rows-[1fr_auto] gap-8 overflow-hidden rounded-2xl p-8">
            <div className="relative -m-8 flex aspect-video items-center bg-linear-to-b p-8 [--color-background:var(--color-muted)] @xl:aspect-auto">
              <div className="absolute -inset-x-6 inset-y-0 bg-[repeating-linear-gradient(-45deg,white,white_1px,transparent_1px,transparent_6px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 mix-blend-overlay" />
              <ReplyIllustration className="relative mt-0 w-full" />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.replyCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.replyCell.bodyKey)}
              </p>
            </div>
          </Card>

          {/* Row 2 — formula spans 2 cols, then a stacked column for leaderboard + stat */}
          <Card className="grid grid-rows-[1fr_auto] gap-8 rounded-2xl p-8 [--color-background:var(--color-muted)] @xl:col-span-2">
            <div className="relative flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] opacity-10" />

              <div className="flex aspect-video flex-col items-center gap-12 @lg:flex-row @4xl:aspect-auto">
                <div className="relative">
                  <div className="bg-foreground/5 relative mx-auto size-fit p-2">
                    <FormulaCornerDecorator className="size-2" />
                    <DocumentIllustration />
                  </div>
                  <ArrowBigRight
                    strokeWidth={4}
                    aria-hidden="true"
                    className="fill-illustration dark:fill-foreground/25 absolute bottom-0 translate-x-[125%] translate-y-[200%] rotate-90 stroke-transparent drop-shadow @lg:inset-y-0 @lg:right-0 @lg:my-auto @lg:translate-x-[150%] @lg:rotate-0 @xl:translate-y-0"
                  />
                </div>

                <div className="relative">
                  <IDCheckIllustration />
                  <Equal
                    strokeWidth={4}
                    aria-hidden="true"
                    className="dark:fill-foreground/25 dark:stroke-foreground/25 fill-illustration stroke-illustration absolute inset-x-0 bottom-0 mx-auto translate-y-[150%] drop-shadow @lg:inset-x-auto @lg:inset-y-0 @lg:right-0 @lg:my-auto @lg:translate-x-[150%] @xl:translate-y-0"
                  />
                </div>

                <div className="relative mx-auto flex size-fit -space-x-6">
                  <DocumentIllustration className="translate-y-1 -rotate-12" />
                  <DocumentIllustration className="relative z-11" />
                  <DocumentIllustration className="translate-y-1 rotate-12" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.formulaCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-3 text-balance">
                {tRoot(props.formulaCell.bodyKey)}
              </p>
            </div>
          </Card>

          <div className="grid grid-rows-[1fr_auto] space-y-4 @xl:row-start-2 @xl:space-y-0 @4xl:row-start-auto @4xl:space-y-4">
            <Card className="group grid grid-rows-[1fr_auto] gap-8 overflow-hidden rounded-2xl p-8">
              <div className="relative flex flex-wrap items-center justify-between gap-1 from-transparent via-blue-50 to-indigo-50">
                <div className="mx-auto size-2/3">
                  <LeaderboardIsoIllustration />
                </div>
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.leaderboardCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  {tRoot(props.leaderboardCell.bodyKey)}
                </p>
              </div>
            </Card>
            <Card className="group space-y-4 overflow-hidden rounded-2xl p-8 text-center @xl:hidden @4xl:block">
              <span className="to-primary from-foreground block bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent">
                {tRoot(props.statCell.percentKey)}
              </span>
              <div>
                <p className="text-foreground font-semibold">
                  {tRoot(props.statCell.labelKey)}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormulaCornerDecorator({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "border-primary absolute -top-px -left-px block size-2.5 border-t-[1.5px] border-l-[1.5px]",
          className,
        )}
      />
      <span
        className={cn(
          "border-primary absolute -top-px -right-px block size-2.5 border-t-[1.5px] border-r-[1.5px]",
          className,
        )}
      />
      <span
        className={cn(
          "border-primary absolute -bottom-px -left-px block size-2.5 border-b-[1.5px] border-l-[1.5px]",
          className,
        )}
      />
      <span
        className={cn(
          "border-primary absolute -right-px -bottom-px block size-2.5 border-r-[1.5px] border-b-[1.5px]",
          className,
        )}
      />
    </>
  );
}
