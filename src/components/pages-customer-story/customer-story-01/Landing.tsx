import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Quote } from "lucide-react";
import { PortableText } from "@portabletext/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui-primitives/breadcrumb";
import { layoutRegistry, type LayoutName } from "@/components/layouts/registry";
import { Header10 } from "@/components/layouts/_shared/site-headers/header-10";
import { SiteFooter2 } from "@/components/layouts/_shared/site-footers/site-footer-2";
import { formatDate } from "./lib/format-date";
import { portableTextComponents } from "./content-components";
import { customerStory01Sample, type CustomerStory } from "./sample";
import { customerStory01Defaults, customerStory01Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
  /**
   * Customer-story content. Defaults to `customerStory01Sample`
   * so Storybook + the live route render without a CMS connection.
   */
  story?: CustomerStory;
};

export function Landing({
  layout = customerStory01Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
  story = customerStory01Sample,
}: LandingProps = {}) {
  const t = useTranslations(customerStory01Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <div aria-hidden className="h-14 lg:h-[73px]" />
      <div
        id={customerStory01Defaults.sectionIds.article}
        className="relative mx-auto max-w-5xl px-6 pt-6 pb-16 md:pb-24 lg:pt-12"
      >
        <article className="mx-auto max-w-2xl">
          <header className="mb-12">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>{story.name}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Customer Logo and Info */}
            <div className="mt-6 mb-12 space-y-12">
              <h2 className="text-foreground text-3xl font-bold text-balance md:text-4xl">
                {story.title}
              </h2>

              {story.image && (
                <div className="relative -mx-6 overflow-hidden rounded-xl border shadow shadow-black/5 sm:-mx-16 lg:-mx-32">
                  <Image
                    src={story.image}
                    alt={story.name}
                    width={1200}
                    height={675}
                    className="aspect-21/9 w-full object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            <p className="text-foreground text-xl leading-relaxed">{story.about}</p>

            <div className="mt-12 flex flex-wrap gap-4 border-y py-6 *:space-y-2 max-sm:gap-x-6 sm:grid sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Founded
                </p>
                <p className="text-foreground">{formatDate(story.dateFounded)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Joined
                </p>
                <p className="text-foreground">{formatDate(story.dateJoined)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Website
                </p>
                <Link
                  href={story.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  Visit Site
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          </header>

          {story.body && story.body.length > 0 && (
            <div className="prose prose-slate dark:prose-invert mb-12 max-w-none">
              <PortableText value={story.body} components={portableTextComponents} />
            </div>
          )}

          {story.testimonial && (
            <div className="relative mt-12 border-t pt-12">
              <Quote className="fill-muted-foreground stroke-muted-foreground md:absolute md:-left-16 md:size-8" />
              <blockquote className="mb-6 max-md:mt-6">
                <p className="text-foreground text-lg leading-relaxed">
                  &quot;{story.testimonial.quote}&quot;
                </p>
              </blockquote>
              <div className="flex items-center gap-4">
                {story.testimonial.author.image && (
                  <div className="ring-border-illustration bg-card aspect-square size-12 shrink-0 overflow-hidden rounded-full border border-transparent shadow-md ring-1 shadow-black/15">
                    <Image
                      src={story.testimonial.author.image}
                      alt={story.testimonial.author.name}
                      width={96}
                      height={96}
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-foreground font-semibold">
                    {story.testimonial.author.name}
                  </p>
                  {story.testimonial.author.role && (
                    <p className="text-muted-foreground text-sm">
                      {story.testimonial.author.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}
