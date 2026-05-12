import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Quote, Slash } from "lucide-react";
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
import { Container } from "@/components/ui-primitives/grid-1-customer-story-one-container";
import { formatDate } from "./lib/format-date";
import { portableTextComponents } from "./content-components";
import { customerStory02Sample, type CustomerStory } from "./sample";
import { customerStory02Defaults, customerStory02Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
  /**
   * Customer-story content. Defaults to `customerStory02Sample`
   * so Storybook + the live route render without a CMS connection.
   */
  story?: CustomerStory;
};

/** Tailark Pro `grid-1-customer-story-one` faithful port. */
export function Landing({
  layout = customerStory02Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
  story = customerStory02Sample,
}: LandingProps = {}) {
  const t = useTranslations(customerStory02Namespace);
  const Layout = layoutRegistry[layout];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <div aria-hidden className="h-14 lg:h-[73px]" />
      <div id={customerStory02Defaults.sectionIds.article}>
        <Container className="border-b">
          <article className="space-y-12 max-lg:p-2">
            <header className="mx-auto max-w-3xl">
              <Breadcrumb>
                <BreadcrumbList className="justify-center gap-0.5">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Slash className="-rotate-16" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="text-foreground">
                      {story.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <h2 className="text-foreground mt-6 text-center text-3xl font-bold text-balance md:text-4xl md:leading-tight">
                {story.title}
              </h2>
            </header>

            {story.image && (
              <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border shadow shadow-black/5">
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

            <div className="mx-auto max-w-2xl space-y-12">
              <p className="text-foreground text-xl leading-relaxed">{story.about}</p>

              <div className="flex flex-wrap gap-4 border-y py-6 *:space-y-2 max-sm:gap-x-6 sm:grid sm:grid-cols-3">
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

              {story.body && story.body.length > 0 && (
                <div className="prose prose-slate dark:prose-invert mb-12 max-w-none">
                  <PortableText value={story.body} components={portableTextComponents} />
                </div>
              )}

              {story.testimonial && (
                <div className="relative border-t pt-12">
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
            </div>
          </article>
        </Container>
      </div>
    </Layout>
  );
}
