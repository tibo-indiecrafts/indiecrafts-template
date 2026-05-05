import { ChatBubblesIllustration } from "@/components/ui-illustrations/chat-bubbles-illustration";
import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import { NotificationIllustration } from "@/components/ui-illustrations/notification-illustration";
import { ReplyIllustration } from "@/components/ui-illustrations/reply-illustration";
import { ScheduleIllustration } from "@/components/ui-illustrations/schedule-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { bento12Namespace } from "./config";
import type { BentoBlock } from "./schema";

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento12Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6">
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
                {tRoot(props.filesharingCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.filesharingCell.bodyKey)}
              </p>
            </div>
            <NotificationIllustration variant="mixed" />
          </div>

          <div className="border-background grid gap-8 border-y @3xl:col-span-2 @3xl:grid-cols-2 @3xl:gap-22">
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

          <div className="row-span-2 grid grid-rows-subgrid gap-8 border-t @3xl:gap-12 @3xl:border-r">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {tRoot(props.collaborationCell.titleKey)}
              </h3>
              <p className="text-muted-foreground mt-4 text-lg">
                {tRoot(props.collaborationCell.bodyKey)}
              </p>
            </div>
            <ReplyIllustration className="self-end" />
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
