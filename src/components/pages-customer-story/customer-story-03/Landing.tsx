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
import { Container } from "@/components/ui-effects/grid-2-customer-story-one-container";
import { formatDate } from "./lib/format-date";
import { extractHeadings } from "./lib/extract-headings";
import { portableTextComponents } from "./content-components";
import { customerStory03Sample, type CustomerStory } from "./sample";
import { customerStory03Defaults, customerStory03Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;

  story?: CustomerStory;
};

export function Landing({
  layout = customerStory03Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
  story = customerStory03Sample,
}: LandingProps = {}) {
  const t = useTranslations(customerStory03Namespace);
  const Layout = layoutRegistry[layout];
  const headings = story.body ? extractHeadings(story.body) : [];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      {/* Theme-aware tint so the grid-2 Container's `bg-card/90` cells
          stand out as visible 1px hairlines (the "fancy lines"). */}
      <article
        id={customerStory03Defaults.sectionIds.article}
        className="bg-foreground/10"
      >
        <div aria-hidden className="h-14 lg:h-[73px]" />
        <Container className="p-6 lg:p-12">
          <header className="max-w-2xl">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/customers">Customers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-foreground">
                    {story.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h2 className="text-foreground mt-6 text-3xl font-bold text-balance md:text-4xl">
              {story.title}
            </h2>
          </header>
        </Container>

        <Container className="lg:grid-cols-[auto_1fr]" asGrid>
          <div>
            <div data-grid-content className="max-w-3xl p-6 lg:p-12">
              {story.image && (
                <div className="relative overflow-hidden rounded-xl border shadow shadow-black/5">
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

              <div>
                <p className="text-foreground my-12 text-xl md:text-2xl">{story.about}</p>

                {story.body && story.body.length > 0 && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <PortableText
                      value={story.body}
                      components={portableTextComponents}
                    />
                  </div>
                )}

                {story.testimonial && (
                  <div className="mt-12 border-t pt-12">
                    <Quote className="fill-background stroke-background mb-6 drop-shadow-md" />
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
            </div>
          </div>
          <div>
            <div data-grid-content>
              <div className="h-fit p-6 lg:sticky lg:top-20 lg:p-12">
                <div className="max-lg:hidden">
                  {headings.length > 0 && (
                    <nav>
                      <h4 className="text-foreground mb-4 text-sm font-semibold">
                        On this page
                      </h4>
                      <ul className="space-y-3 text-sm">
                        {headings.map((heading) => (
                          <li key={heading.slug}>
                            <a
                              href={`#${heading.slug}`}
                              className={`text-muted-foreground hover:text-foreground block transition-colors ${heading.level === 3 ? "pl-4" : ""}`}
                            >
                              {heading.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>
                <div className="mt-6">
                  <h4 className="text-foreground mb-4 text-sm font-semibold">Company</h4>

                  <div className="flex items-center gap-3">
                    <div className="ring-border-illustration bg-card flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-transparent p-2 shadow-md ring-1 shadow-black/15">
                      <Image
                        src={story.logo}
                        alt={story.name}
                        width={96}
                        height={96}
                        className="size-full object-contain"
                      />
                    </div>
                    <span className="text-foreground line-clamp-1 text-sm font-semibold">
                      {story.name}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-foreground mb-2 text-sm font-semibold">
                      Founded
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(story.dateFounded)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-foreground mb-2 text-sm font-semibold">Joined</h4>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(story.dateJoined)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-foreground mb-2 text-sm font-semibold">
                      Website
                    </h4>
                    <Link
                      href={story.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm transition-colors"
                    >
                      Visit Site
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </Layout>
  );
}
