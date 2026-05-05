import Image from "next/image";
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui-primitives/card";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { Slack } from "@/components/ui-primitives/svgs/slack";
import { Twilio } from "@/components/ui-primitives/svgs/twilio";
import { useScopedT } from "@/i18n/scoped-t";
import { features11Namespace } from "./config";
import type { FeaturesBlock } from "./schema";

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr] = useScopedT(features11Namespace);
  const trackingAlt = tr(props.trackingImageAltKey, "tracking.imageAlt");
  const uxAlt = tr(props.uxImageAltKey, "uxImageAlt");
  return (
    <section aria-labelledby={`${props.id}-title`} className="bg-muted/40 py-16 md:py-32">
      <h2 id={`${props.id}-title`} className="sr-only">
        {tr(props.trackingTitleKey, "tracking.title")}
      </h2>
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          <Card className="group overflow-hidden sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium">
                  {tr(props.trackingTitleKey, "tracking.title")}
                </p>
                <p className="text-muted-foreground mt-3 max-w-sm text-sm">
                  {tr(props.trackingBodyKey, "tracking.body")}
                </p>
              </div>
            </CardHeader>

            <div className="relative h-fit mask-b-from-75% mask-b-to-95% pl-6 md:pl-12">
              <div className="bg-background overflow-hidden rounded-tl-lg border-t border-l pt-2 pl-2">
                <Image
                  src={props.trackingImageDarkUrl}
                  className="hidden h-full w-full object-cover dark:block"
                  alt={trackingAlt}
                  width={1207}
                  height={929}
                />
                <Image
                  src={props.trackingImageLightUrl}
                  className="h-full w-full object-cover shadow dark:hidden"
                  alt={trackingAlt}
                  width={1207}
                  height={929}
                />
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <p className="mx-auto my-6 max-w-md px-6 text-center text-lg font-semibold text-balance sm:text-2xl md:p-6">
              {tr(props.uxTitleKey, "ux")}
            </p>

            <CardContent className="mt-auto h-fit">
              <div className="relative mask-radial-[75%_75%] mask-radial-from-75% mask-radial-at-right max-sm:mb-6">
                <div className="aspect-76/59 overflow-hidden rounded-r-lg border">
                  <Image
                    src={props.uxImageDarkUrl}
                    className="hidden h-full w-full object-cover dark:block"
                    alt={uxAlt}
                    width={1207}
                    height={929}
                  />
                  <Image
                    src={props.uxImageLightUrl}
                    className="h-full w-full object-cover shadow dark:hidden"
                    alt={uxAlt}
                    width={1207}
                    height={929}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group p-6 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
            <p className="mx-auto mb-12 max-w-md text-center text-lg font-semibold text-balance sm:text-2xl">
              {tr(props.shortcutTitleKey, "shortcut")}
            </p>

            <div className="flex justify-center gap-6" aria-hidden="true">
              <div className="bg-muted/35 relative flex aspect-square size-16 items-center rounded-[7px] border p-3 shadow-lg ring inset-shadow-sm">
                <span className="absolute top-1 right-2 block text-sm">fn</span>
                <Globe className="mt-auto size-4" />
              </div>
              <div className="bg-muted/35 flex aspect-square size-16 items-center justify-center rounded-[7px] border p-3 shadow-lg ring inset-shadow-sm">
                <span>K</span>
              </div>
            </div>
          </Card>

          <Card className="group relative sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium">
                {tr(props.integrationsTitleKey, "integrations.title")}
              </p>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                {tr(props.integrationsBodyKey, "integrations.body")}
              </p>
            </CardHeader>
            <CardContent
              className="relative h-fit px-6 pb-6 md:px-12 md:pb-12"
              aria-hidden="true"
            >
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="bg-muted/50 flex aspect-square items-center justify-center rounded-(--radius) border p-4">
                  <Linear className="*:fill-foreground m-auto size-6" />
                </div>
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="bg-muted/50 flex aspect-square items-center justify-center rounded-(--radius) border p-4">
                  <Twilio className="*:fill-foreground m-auto size-6" />
                </div>
                <div className="aspect-square rounded-(--radius) border border-dashed" />
                <div className="bg-muted/50 flex aspect-square items-center justify-center rounded-(--radius) border p-4">
                  <Slack className="**:fill-foreground m-auto size-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
