import { CodeTabs } from "@/components/ui-molecules/code/code-tabs";
import type { CodeDemoBlock } from "./schema";

export default function CodeDemo(props: Readonly<CodeDemoBlock>) {
  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Code preview
      </h2>
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="relative @3xl:p-12">
          <div
            aria-hidden
            className="border-foreground/5 pointer-events-none absolute -inset-x-12 inset-y-0 hidden border-y mask-x-from-95% @3xl:block"
          />
          <div
            aria-hidden
            className="border-foreground/5 pointer-events-none absolute inset-x-0 -inset-y-12 hidden border-x mask-y-from-95% @3xl:block"
          />
          <CodeTabs />
        </div>
      </div>
    </section>
  );
}
