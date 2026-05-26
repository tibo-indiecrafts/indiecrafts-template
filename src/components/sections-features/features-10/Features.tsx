import { Card, CardContent, CardHeader } from "@/components/ui-primitives/card";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { Calendar, LucideIcon, MapIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { features10Namespace } from "./config";
import type { FeaturesBlock } from "./schema";

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr] = useScopedT(features10Namespace);
  return (
    <section aria-labelledby={`${props.id}-title`} className="bg-muted/40 py-16 md:py-32">
      <h2 id={`${props.id}-title`} className="sr-only">
        {tr(props.stampsTitleKey, "stamps")}
      </h2>
      <div className="mx-auto max-w-2xl px-(--gutter) lg:max-w-5xl">
        <div className="mx-auto grid gap-4 lg:grid-cols-2">
          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                icon={MapIcon}
                title={tr(props.trackingEyebrowKey, "tracking.eyebrow")}
                description={tr(props.trackingBodyKey, "tracking.body")}
              />
            </CardHeader>

            <div className="relative border-t border-dashed max-sm:mb-6">
              <div
                aria-hidden
                className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--color-white)_100%)]"
              />
              <div className="aspect-76/59 p-1 px-6">
                <DualModeImage
                  darkSrc={props.trackingImageDarkUrl}
                  lightSrc={props.trackingImageLightUrl}
                  alt={tr(props.trackingImageAltKey, "tracking.imageAlt")}
                  width={1207}
                  height={929}
                />
              </div>
            </div>
          </FeatureCard>

          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                icon={Calendar}
                title={tr(props.schedulingEyebrowKey, "scheduling.eyebrow")}
                description={tr(props.schedulingBodyKey, "scheduling.body")}
              />
            </CardHeader>

            <CardContent>
              <div className="relative mask-radial-[75%_75%] mask-radial-from-75% mask-radial-at-right max-sm:mb-6">
                <div className="aspect-76/59 overflow-hidden rounded-lg border">
                  <DualModeImage
                    darkSrc={props.schedulingImageDarkUrl}
                    lightSrc={props.schedulingImageLightUrl}
                    alt={tr(props.schedulingImageAltKey, "scheduling.imageAlt")}
                    width={1207}
                    height={929}
                  />
                </div>
              </div>
            </CardContent>
          </FeatureCard>

          <FeatureCard className="p-6 lg:col-span-2">
            <p className="mx-auto my-6 max-w-md text-center text-2xl font-semibold text-balance">
              {tr(props.stampsTitleKey, "stamps")}
            </p>

            <div className="flex justify-center gap-6 overflow-hidden">
              <CircularUI
                label="Inclusion"
                circles={[{ pattern: "border" }, { pattern: "border" }]}
              />

              <CircularUI
                label="Inclusion"
                circles={[{ pattern: "none" }, { pattern: "primary" }]}
              />

              <CircularUI
                label="Join"
                circles={[{ pattern: "blue" }, { pattern: "none" }]}
              />

              <CircularUI
                label="Exclusion"
                circles={[{ pattern: "primary" }, { pattern: "none" }]}
                className="hidden sm:block"
              />
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card className={cn("group relative rounded-none shadow-zinc-950/5", className)}>
    <CardDecorator />
    {children}
  </Card>
);

const CardDecorator = () => (
  <>
    <span className="border-primary absolute -top-px -left-px block size-2 border-t-2 border-l-2"></span>
    <span className="border-primary absolute -top-px -right-px block size-2 border-t-2 border-r-2"></span>
    <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
    <span className="border-primary absolute -right-px -bottom-px block size-2 border-r-2 border-b-2"></span>
  </>
);

interface CardHeadingProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div className="p-6">
    <span className="text-muted-foreground flex items-center gap-2">
      <Icon className="size-4" />
      {title}
    </span>
    <p className="mt-8 text-2xl font-semibold">{description}</p>
  </div>
);

interface DualModeImageProps {
  darkSrc: string;
  lightSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const DualModeImage = ({
  darkSrc,
  lightSrc,
  alt,
  width,
  height,
  className,
}: DualModeImageProps) => (
  <>
    <Image
      src={darkSrc}
      className={cn("hidden h-full w-full object-cover dark:block", className)}
      alt={`${alt} dark`}
      width={width}
      height={height}
    />
    <Image
      src={lightSrc}
      className={cn("h-full w-full object-cover shadow dark:hidden", className)}
      alt={`${alt} light`}
      width={width}
      height={height}
    />
  </>
);

interface CircleConfig {
  pattern: "none" | "border" | "primary" | "blue";
}

interface CircularUIProps {
  label: string;
  circles: CircleConfig[];
  className?: string;
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
  <div className={className}>
    <div className="from-border size-fit rounded-2xl bg-linear-to-b to-transparent p-px">
      <div className="from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] bg-linear-to-b p-4">
        {circles.map((circle, i) => (
          <div
            key={i}
            className={cn("size-7 rounded-full border sm:size-8", {
              "border-primary": circle.pattern === "none",
              "border-primary bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_4px)]":
                circle.pattern === "border",
              "border-primary bg-background bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)]":
                circle.pattern === "primary",
              "bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,var(--color-blue-500),var(--color-blue-500)_1px,transparent_1px,transparent_4px)]":
                circle.pattern === "blue",
            })}
          ></div>
        ))}
      </div>
    </div>
    <span className="text-muted-foreground mt-1.5 block text-center text-sm">
      {label}
    </span>
  </div>
);
