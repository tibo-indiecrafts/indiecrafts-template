import { Equal, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui-primitives/button";
import { ActionableIllustration } from "@/components/ui-illustrations/actionable-illustration";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { IDCheckIllustration } from "@/components/ui-illustrations/id-check-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { howItWorks06Namespace } from "./config";
import type { HowItWorksBlock, HowItWorksIllustration } from "./schema";

const ILLUSTRATIONS: Record<HowItWorksIllustration, () => ReactNode> = {
  documentBoxed: () => (
    <div className="bg-foreground/5 relative mx-auto size-fit border p-2">
      <CardDecorator className="border-primary size-2" />
      <DocumentIllustration />
    </div>
  ),
  idCheck: () => <IDCheckIllustration />,
  actionable: () => <ActionableIllustration className="max-w-58 self-center" />,
};

const CONNECTORS: ReadonlyArray<typeof Plus | typeof Equal | null> = [Plus, Equal, null];

export default function HowItWorks(props: Readonly<HowItWorksBlock>) {
  const [, , tRoot] = useScopedT(howItWorks06Namespace);
  const ctaExternal = props.ctaHref.startsWith("http");

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background overflow-hidden"
    >
      <div className="relative m-4 overflow-hidden rounded-[2rem] py-24">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(black_1px,transparent_1px)] [background-size:16px_16px] mix-blend-overlay"
        />

        <div className="@container relative mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id={`${props.id}-heading`}
              className="text-foreground text-4xl font-semibold"
            >
              {tRoot(props.headerTitleKey)}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg text-balance">
              {tRoot(props.headerBodyKey)}
            </p>
          </div>

          <div className="my-20 grid gap-12 @3xl:grid-cols-3">
            {props.steps.map((step, index) => {
              const renderIllustration = ILLUSTRATIONS[step.illustration];
              const Connector = CONNECTORS[index];
              return (
                <div
                  key={index}
                  className="row-span-3 grid grid-rows-subgrid gap-8 text-center"
                >
                  <div className="relative flex h-28 items-center self-center">
                    {renderIllustration()}
                    {Connector ? (
                      <Connector
                        strokeWidth={4}
                        aria-hidden="true"
                        className="fill-illustration stroke-illustration absolute inset-y-0 right-0 my-auto hidden translate-x-[75%] drop-shadow @3xl:block"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-foreground mb-3 font-medium">
                      {tRoot(step.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-sm text-balance">
                      {tRoot(step.bodyKey)}
                    </p>
                  </div>
                  {Connector ? (
                    <Connector
                      strokeWidth={4}
                      aria-hidden="true"
                      className="fill-illustration stroke-illustration mx-auto translate-y-[75%] drop-shadow @3xl:hidden"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <Button asChild variant="outline" className="mx-auto flex w-fit">
            <a
              href={props.ctaHref}
              target={ctaExternal ? "_blank" : undefined}
              rel={ctaExternal ? "noopener noreferrer" : undefined}
            >
              {tRoot(props.ctaLabelKey)}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CardDecorator({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "absolute -top-px -left-px block size-2 rounded-tl border-t border-l",
          className,
        )}
      />
      <span
        className={cn(
          "absolute -top-px -right-px block size-2 rounded-tr border-t border-r",
          className,
        )}
      />
      <span
        className={cn(
          "absolute -bottom-px -left-px block size-2 rounded-bl border-b border-l",
          className,
        )}
      />
      <span
        className={cn(
          "absolute -right-px -bottom-px block size-2 rounded-br border-r border-b",
          className,
        )}
      />
    </>
  );
}
