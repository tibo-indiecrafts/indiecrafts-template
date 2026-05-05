import Image from "next/image";
import { AddCommentIllustration } from "@/components/ui-illustrations/add-comment-illustration";
import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { ScheduleIllustration } from "@/components/ui-illustrations/schedule-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { bento11Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento11Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="border *:p-8 @3xl:grid @3xl:grid-cols-2 @3xl:*:p-12">
          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-b @3xl:gap-12 @3xl:border-r">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.financialCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.financialCell.bodyKey)}
              </p>
            </div>
            <CurrencyIllustration />
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-b @3xl:gap-12">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.documentsCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.documentsCell.bodyKey)}
              </p>
            </div>
            <div className="relative flex gap-4">
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
            </div>
          </div>

          <div className="border-background col-span-2 border-y">
            <blockquote className="max-w-xl">
              <p className="text-lg sm:text-xl">
                {tRoot(props.testimonialCell.quoteKey)}
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="bg-background size-7 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                  <Image
                    className="aspect-square rounded-full object-cover"
                    src={props.testimonialCell.authorAvatarUrl}
                    alt=""
                    aria-hidden="true"
                    height={52}
                    width={52}
                  />
                </div>
                <span>{tRoot(props.testimonialCell.authorNameKey)}</span>
                <span className="text-muted-foreground">
                  {tRoot(props.testimonialCell.authorHandleKey)}
                </span>
              </div>
            </blockquote>
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-t @3xl:gap-12 @3xl:border-r">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.collaborationCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.collaborationCell.bodyKey)}
              </p>
            </div>
            <AddCommentIllustration className="self-end pl-6" />
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-t @3xl:gap-12">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.schedulingCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.schedulingCell.bodyKey)}
              </p>
            </div>
            <ScheduleIllustration className="self-end pl-9" />
          </div>
        </div>
      </div>
    </section>
  );
}
