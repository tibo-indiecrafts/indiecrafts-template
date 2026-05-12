import { Check, Database, Globe, RefreshCw, Shield, Workflow } from "lucide-react";
import { Container } from "@/components/ui-primitives/grid-2-product-container";
import {
  FeatureCard,
  FeatureCardContent,
} from "@/components/ui-primitives/grid-2-product-feature-card";
import { Button } from "@/components/ui-primitives/grid-2-product-button";
import Link from "next/link";
import { Flow2Illustration } from "@/components/ui-illustrations/grid-2-product-flow-2-illustration";

const subFeatures = [
  {
    icon: RefreshCw,
    title: "Real-Time Sync",
    description:
      "Keep your data consistent across all layers with automatic synchronization.",
  },
  {
    icon: Shield,
    title: "Encrypted at Rest",
    description:
      "All data is encrypted end-to-end across every storage and transit layer.",
  },
  {
    icon: Globe,
    title: "Global Distribution",
    description: "Serve your data from edge locations closest to your users worldwide.",
  },
  {
    icon: Database,
    title: "Automated Backups",
    description:
      "Continuous backups with point-in-time recovery for disaster resilience.",
  },
];

export function PipelineFeatures() {
  return (
    <section>
      <Container className="py-16 lg:py-24">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-foreground text-4xl font-semibold text-balance lg:text-5xl">
            Unified Data Pipeline
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            Connect your data sources and let Tailark handle the rest. Automatically
            distribute, cache, and back up your data across a global infrastructure.
          </p>
        </div>
      </Container>
      <Container asGrid>
        <div className="grid gap-px @2xl:grid-cols-2 @4xl:grid-cols-10">
          <div aria-hidden className="@max-4xl:hidden">
            <div data-grid-content />
          </div>
          <div className="@4xl:col-span-4">
            <FeatureCard className="col-span-full grid-rows-1 @4xl:col-span-2">
              <FeatureCardContent className="flex h-full flex-col space-y-6 @4xl:pb-12">
                <div className="bg-card ring-foreground/3 flex size-12 rounded-full shadow-xl ring-1 shadow-black/5">
                  <Workflow className="text-muted-foreground m-auto size-4" />
                </div>
                <h3 className="text-3xl font-semibold">Source to Edge</h3>
                <p className="text-muted-foreground text-balance">
                  Ingest from any data source and automatically route to caching layers,
                  CDN nodes, and backup storage — all through a single pipeline.
                </p>
                <ul className="w-full space-y-2">
                  {[
                    "Multi-Region Cache Invalidation",
                    "Instant CDN Propagation",
                    "Continuous Incremental Backups",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex items-center gap-2"
                    >
                      <Check className="size-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
                  <Link href="#">Learn more</Link>
                </Button>
              </FeatureCardContent>
            </FeatureCard>
          </div>
          <div
            data-grid-content
            className="group flex items-center @max-4xl:py-12 @4xl:col-span-4"
          >
            <Flow2Illustration />
          </div>
          <div aria-hidden className="@max-4xl:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
      <Container
        asGrid
        className="grid-cols-2 **:data-grid-content:p-6 @4xl:grid-cols-10 @4xl:**:data-grid-content:p-8 @5xl:**:data-grid-content:p-12"
      >
        <div aria-hidden className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
        <div className="col-span-8 grid gap-px @sm:grid-cols-2 @4xl:grid-cols-3">
          {subFeatures.map((feature, index) => (
            <div key={index} className="@4xl:last:hidden">
              <div data-grid-content className="space-y-3">
                <feature.icon className="size-4" />
                <h3 className="mt-3 font-medium">{feature.title}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div aria-hidden className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>
    </section>
  );
}
