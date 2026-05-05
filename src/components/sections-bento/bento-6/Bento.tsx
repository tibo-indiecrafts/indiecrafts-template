import type { ReactNode } from "react";
import { Card } from "@/components/ui-primitives/card";
import { ChartCompactIllustration } from "@/components/ui-illustrations/chart-compact-illustration";
import { KitIllustration } from "@/components/ui-illustrations/kit-illustration";
import { MessageChatIllustration } from "@/components/ui-illustrations/message-chat-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { bento6Namespace } from "./config";
import type { BentoBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <span className="text-foreground font-medium">{chunks}</span>
  ),
};

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento6Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-5">
          <div className="space-y-3 @4xl:col-span-2">
            <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.chartCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot(props.chartCell.bodyKey)}
                </p>
              </div>
              <div aria-hidden>
                <ChartCompactIllustration />
              </div>
            </Card>
            <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">
                  {tRoot(props.messageCell.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-2 text-balance">
                  {tRoot(props.messageCell.bodyKey)}
                </p>
              </div>
              <MessageChatIllustration />
            </Card>
          </div>

          <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 @4xl:col-span-3">
            <div>
              <h3 className="text-foreground font-semibold">
                {tRoot(props.kitCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-balance">
                {tRoot.rich(props.kitCell.bodyKey, RICH_STRONG)}
              </p>
            </div>
            <div className="self-center">
              <KitIllustration />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
