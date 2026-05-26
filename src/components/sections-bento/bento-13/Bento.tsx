import { ChatBubblesIllustration } from "@/components/ui-illustrations/chat-bubbles-illustration";
import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { NotificationIllustration } from "@/components/ui-illustrations/notification-illustration";
import { ReplyIllustration } from "@/components/ui-illustrations/reply-illustration";
import { ScheduleIllustration } from "@/components/ui-illustrations/schedule-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { bento13Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento13Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="grid border *:p-8 @3xl:grid-cols-6 @3xl:*:p-12">
          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-b @3xl:col-span-3 @3xl:gap-12 @3xl:border-r">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.collaborationCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.collaborationCell.bodyKey)}
              </p>
            </div>
            <ReplyIllustration />
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-b @3xl:col-span-3 @3xl:gap-12">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.documentsCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.documentsCell.bodyKey)}
              </p>
            </div>
            <div className="relative flex gap-4 self-end">
              <DocumentIllustration />
              <DocumentIllustration />
              <DocumentIllustration />
            </div>
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 @max-3xl:border-b @3xl:col-span-3 @3xl:gap-12 @3xl:border-r @4xl:col-span-2">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.financialCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.financialCell.bodyKey)}
              </p>
            </div>
            <div className="self-end">
              <CurrencyIllustration />
            </div>
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 @3xl:col-span-3 @3xl:gap-12 @4xl:col-span-4">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.chatCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.chatCell.bodyKey)}
              </p>
            </div>
            <ChatBubblesIllustration />
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-t @3xl:col-span-3 @3xl:gap-12 @3xl:border-r">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.schedulingCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.schedulingCell.bodyKey)}
              </p>
            </div>
            <ScheduleIllustration className="pt-12 pl-9" />
          </div>

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-t @3xl:col-span-3 @3xl:gap-12">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.filesharingCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.filesharingCell.bodyKey)}
              </p>
            </div>
            <NotificationIllustration variant="mixed" />
          </div>
        </div>
      </div>
    </section>
  );
}
