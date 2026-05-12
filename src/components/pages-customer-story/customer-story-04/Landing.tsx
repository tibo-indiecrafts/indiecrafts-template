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
import { extractHeadings } from "./lib/extract-headings";
import { portableTextComponents } from "./content-components";
import { customerStory04Sample, type CustomerStory } from "./sample";
import { customerStory04Defaults, customerStory04Namespace } from "./config";

export type LandingProps = {
  layout?: LayoutName;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
  /**
   * Customer-story content. Defaults to `customerStory04Sample`
   * so Storybook + the live route render without a CMS connection.
   */
  story?: CustomerStory;
};

/** Tailark Pro `libre-customer-story-one` faithful port. */
export function Landing({
  layout = customerStory04Defaults.layout,
  header = <Header10 />,
  footer = <SiteFooter2 />,
  story = customerStory04Sample,
}: LandingProps = {}) {
  const t = useTranslations(customerStory04Namespace);
  const Layout = layoutRegistry[layout];
  const headings = story.body ? extractHeadings(story.body) : [];

  return (
    <Layout header={header} footer={footer}>
      <h1 className="sr-only">{t("title")}</h1>
      <div aria-hidden className="h-14 lg:h-[73px]" />
      <div
        id={customerStory04Defaults.sectionIds.article}
        className="@container pt-6 pb-16 md:pb-24 lg:pt-12"
      >
        <div className="relative mx-auto max-w-5xl px-6">
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

          <article className="mt-8">
            <header className="mb-12 max-w-2xl">
              <h2 className="text-foreground mb-6 text-3xl font-bold text-balance md:text-4xl md:leading-tight">
                {story.title}
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {story.about}
              </p>
            </header>

            <div className="flex gap-12">
              <div className="order-last ml-auto max-w-xs">
                <div className="sticky top-20 h-fit w-56">
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

                  <div className="mt-6 flex flex-col gap-6 border-t pt-6">
                    <div>
                      <h4 className="text-foreground mb-4 text-sm font-semibold">
                        Founded
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(story.dateFounded)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-foreground mb-4 text-sm font-semibold">
                        Joined
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(story.dateJoined)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-foreground mb-4 text-sm font-semibold">
                        Website
                      </h4>
                      <Link
                        href={story.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm transition-colors"
                      >
                        Visit Website
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-2xl">
                {story.image && (
                  <div className="relative mb-12 overflow-hidden rounded-xl border shadow shadow-black/5">
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

                {story.body && story.body.length > 0 && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <PortableText
                      value={story.body}
                      components={portableTextComponents}
                    />
                  </div>
                )}

                {story.testimonial && (
                  <div className="mt-16 border-t pt-16">
                    <Quote className="fill-background stroke-background mb-6 drop-shadow-md" />
                    <blockquote className="mb-6">
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
          </article>

          <footer className="mt-12 border-t py-8">
            <div className="flex items-center justify-between">
              <Link
                href="/customers"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                ← Back to Customer Stories
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
