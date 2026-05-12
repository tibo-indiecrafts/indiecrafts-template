import { Button } from "@/components/ui-primitives/grid-2-solution-button";
import Link from "next/link";
import {
  Container,
  Separator,
} from "@/components/ui-primitives/grid-2-solution-container";

export function CallToAction() {
  return (
    <section>
      <Separator className="h-16" />

      <Container>
        <div className="relative overflow-hidden p-6 @lg:p-8 @3xl:p-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-foreground text-4xl font-semibold text-balance lg:text-5xl">
              Create, Sell and Grow
            </h2>
            <p className="text-foreground mt-4 mb-6 text-lg text-balance">
              Join a community of over 1000+ companies and developers who have already
              discovered the power of Tailark.{" "}
            </p>

            <Button
              asChild
              size="lg"
              className="px-4 text-sm shadow-xl shadow-indigo-900/40"
            >
              <Link href="#">Start Testing for free</Link>
            </Button>
          </div>
        </div>
      </Container>

      <Separator className="h-16" />
    </section>
  );
}
