import { Card } from "@/components/ui-primitives/libre-landing-two-card";
import { AddCommentIllustration } from "@/components/ui-illustrations/libre-landing-two-add-comment-illustration";
import { CodeReviewIllustration } from "@/components/ui-illustrations/libre-landing-two-code-review-illustration";
import { MapIllustration } from "@/components/ui-illustrations/libre-landing-two-map-illustration";
import { MeetingIllustration } from "@/components/ui-illustrations/libre-landing-two-meeting-illustration";
import { MessageIllustration } from "@/components/ui-illustrations/libre-landing-two-message-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { features39Namespace } from "./config";
import type { Features39Block } from "./schema";

const HEX_BG_PATH =
  "M1.6015 1033.34L4.26185 1343.72C4.39367 1359.1 16.9052 1371.49 32.2849 1371.48L2310.36 1369.51C2317.81 1369.5 2324.95 1366.53 2330.2 1361.25L2393.36 1297.69C2398.57 1292.44 2401.5 1285.35 2401.5 1277.95V1042.9C2401.5 1036.19 2399.09 1029.7 2394.71 1024.62L2364.79 989.877C2360.41 984.795 2358 978.311 2358 971.603V377.809C2358 370.258 2361.05 363.028 2366.46 357.758L2389.04 335.742C2394.45 330.472 2397.5 323.242 2397.5 315.691V29C2397.5 13.536 2384.96 1 2369.5 1H2300.5H1544.71C1536.92 1 1529.49 4.24189 1524.19 9.94736L1501.81 34.0526C1496.51 39.7581 1489.08 43 1481.29 43H926.196C918.712 43 911.539 40.0038 906.279 34.6801L881.221 9.31992C875.961 3.99621 868.788 1 861.304 1H87.598C80.1719 1 73.05 3.95 67.799 9.20102L9.20101 67.799C3.94999 73.05 1 80.1719 1 87.598V315.075C1 322.101 3.64086 328.869 8.3986 334.038L34.1014 361.962C38.8591 367.131 41.5 373.899 41.5 380.925V970.299C41.5 977.786 38.5014 984.961 33.1741 990.222L9.9264 1013.18C4.53979 1018.5 1.53662 1025.77 1.6015 1033.34Z";

export default function Features(props: Readonly<Features39Block>) {
  const [t] = useScopedT(features39Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="relative overflow-hidden">
      <div aria-hidden className="absolute -inset-x-7 top-12 mask-b-from-65%">
        <svg
          className="text-foreground/15 fill-background/35 w-full origin-top-right max-md:translate-x-3 max-md:scale-x-250 max-md:scale-y-125"
          viewBox="0 0 2402 1372"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={HEX_BG_PATH} stroke="currentColor" />
        </svg>
      </div>
      <div aria-hidden className="absolute -inset-x-7 bottom-0 mask-t-from-65%">
        <svg
          className="text-foreground/15 fill-background/35 w-full origin-top-right max-md:translate-x-3 max-md:scale-x-250 max-md:scale-y-125"
          viewBox="0 0 2402 1372"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={HEX_BG_PATH} stroke="currentColor" />
        </svg>
      </div>
      <div className="@container relative pt-32 pb-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <span className="text-primary font-mono text-sm uppercase">
              {t("eyebrow")}
            </span>
            <div className="mt-8 grid items-end gap-6 md:grid-cols-2">
              <h2
                id={`${props.id}-heading`}
                className="text-foreground text-4xl font-semibold md:text-5xl"
              >
                {t("title")}
              </h2>
              <div className="lg:pl-12">
                <p className="text-muted-foreground text-balance">{t("body")}</p>
              </div>
            </div>
          </div>
          <div className="mt-16 grid gap-2 *:shadow-lg *:shadow-black/5 lg:-mx-8 @xl:grid-cols-2 @3xl:grid-cols-3">
            <Card className="group grid grid-rows-[auto_1fr] gap-8 rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">{t("card1.title")}</h3>
                <p className="text-muted-foreground mt-3">{t("card1.body")}</p>
              </div>

              <AddCommentIllustration shortText variant="mixed" />
            </Card>

            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8 @max-3xl:row-start-1 @xl:@max-3xl:col-start-2">
              <div>
                <h3 className="text-foreground font-semibold">{t("card2.title")}</h3>
                <p className="text-muted-foreground mt-3">{t("card2.body")}</p>
              </div>

              <div
                aria-hidden
                className="border-background -m-8 flex flex-col justify-center border-x bg-linear-to-b from-transparent to-zinc-50"
              >
                <MeetingIllustration />
              </div>
            </Card>
            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">{t("card3.title")}</h3>
                <p className="text-muted-foreground mt-3">{t("card3.body")}</p>
              </div>

              <div
                aria-hidden
                className="border-background -m-8 flex flex-col justify-center border-x bg-linear-to-b from-transparent to-zinc-50 p-8"
              >
                <MessageIllustration />
              </div>
            </Card>
            <Card className="group grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl p-8">
              <div>
                <h3 className="text-foreground font-semibold">{t("card4.title")}</h3>
                <p className="text-muted-foreground mt-3">{t("card4.body")}</p>
              </div>

              <CodeReviewIllustration />
            </Card>
            <Card className="grid grid-rows-[auto_1fr] gap-8 overflow-hidden rounded-2xl px-8 pt-8 @xl:col-span-2">
              <div className="max-w-md">
                <h3 className="text-foreground font-semibold">{t("card5.title")}</h3>
                <p className="text-muted-foreground mt-3">{t("card5.body")}</p>
              </div>
              <MapIllustration />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
