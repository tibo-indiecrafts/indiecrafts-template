import { Activity, BetweenHorizonalEnd, MemoryStick } from "lucide-react";
import { Card } from "@/components/ui-primitives/card";
import { AiPromptIllustration } from "@/components/ui-illustrations/ai-prompt-illustration";
import { DocumentsStackIllustration } from "@/components/ui-illustrations/documents-stack-illustration";
import { FingerprintCardIllustration } from "@/components/ui-illustrations/fingerprint-card-illustration";
import { MapPinsIllustration } from "@/components/ui-illustrations/map-pins-illustration";
import { MemoryUsageIllustration } from "@/components/ui-illustrations/memory-usage-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { bento07Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento07Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid gap-3 @2xl:grid-cols-2 @2xl:grid-rows-2 @4xl:grid-cols-3">
          <div className="grid grid-rows-[auto_1fr] gap-3 @xl:col-span-2 @2xl:row-span-2">
            <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 pb-0">
              <div>
                <BetweenHorizonalEnd
                  className="text-muted-foreground size-4"
                  aria-hidden="true"
                />
                <h3 className="text-foreground mt-4 mb-2 font-medium">
                  {tRoot(props.mapCell.titleKey)}
                </h3>
                <p className="text-muted-foreground text-balance">
                  {tRoot(props.mapCell.bodyKey)}
                </p>
              </div>
              <div className="-mx-8 overflow-hidden">
                <MapPinsIllustration />
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="group grid grid-cols-[auto_1fr] gap-6 overflow-hidden rounded-2xl p-8">
                <div className="*:origin-left *:scale-90 *:duration-1000 *:group-hover:-translate-y-[225%]">
                  <DocumentsStackIllustration />
                </div>
                <div>
                  <h3 className="text-foreground font-medium">
                    {tRoot(props.documentsCell.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-balance">
                    {tRoot(props.documentsCell.bodyKey)}
                  </p>
                </div>
              </Card>
              <Card className="group grid grid-cols-[auto_1fr] gap-6 overflow-hidden rounded-2xl p-8">
                <FingerprintCardIllustration />
                <div>
                  <h3 className="text-foreground font-medium">
                    {tRoot(props.fingerprintCell.titleKey)}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-balance">
                    {tRoot(props.fingerprintCell.bodyKey)}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
            <div>
              <MemoryStick className="text-muted-foreground size-4" aria-hidden="true" />
              <h3 className="text-foreground mt-4 mb-2 font-medium">
                {tRoot(props.memoryCell.titleKey)}
              </h3>
              <p className="text-muted-foreground text-balance">
                {tRoot(props.memoryCell.bodyKey)}
              </p>
            </div>
            <MemoryUsageIllustration />
          </Card>

          <Card className="grid grid-rows-[auto_1fr] gap-8 rounded-2xl p-8">
            <div>
              <Activity className="text-muted-foreground size-4" aria-hidden="true" />
              <h3 className="text-foreground mt-4 mb-2 font-medium">
                {tRoot(props.uptimeCell.titleKey)}
              </h3>
              <p className="text-muted-foreground text-balance">
                {tRoot(props.uptimeCell.bodyKey)}
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <AiPromptIllustration />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
