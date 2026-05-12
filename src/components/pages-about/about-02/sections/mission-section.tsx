import { Container } from "@/components/ui-primitives/grid-2-about-container";

export function MissionSection() {
  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full sm:col-span-8">
            <div data-grid-content className="p-6 @4xl:p-12">
              <h2 className="text-muted-foreground text-balance">Our Mission</h2>
              <div className="text-muted-foreground mt-6 space-y-4 text-xl font-medium *:leading-relaxed *:text-balance">
                <p>
                  <span className="text-foreground">
                    We believe the best software is built when developers can focus on
                    what matters
                  </span>{" "}
                  — solving problems for their users — instead of wrestling with tooling
                  and infrastructure.
                </p>
                <p>
                  <span className="text-foreground">
                    Our mission is to eliminate the friction between idea and execution.
                  </span>{" "}
                  We build primitives, components, and systems that let teams ship
                  production-ready products in days, not months.
                </p>
              </div>
            </div>
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
