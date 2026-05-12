import { Heart, Lightbulb, Shield, Users } from "lucide-react";
import { Container } from "@/components/ui-primitives/grid-2-about-container";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We challenge assumptions and explore uncharted territory. Every product decision starts with a question: what if we could do this better?",
  },
  {
    icon: Heart,
    title: "Craft & Care",
    description:
      "Details matter. From pixel-perfect interfaces to thoughtful documentation, we treat every touchpoint as an opportunity to delight.",
  },
  {
    icon: Users,
    title: "Build Together",
    description:
      "Great products come from diverse perspectives. We foster an environment where everyone has a voice and collaboration is the default.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "We take security seriously. From encrypted data transmission to regular security audits, we ensure your data stays safe.",
  },
];

export function CoreValuesSection() {
  return (
    <section>
      <Container asGrid>
        <div className="grid grid-cols-10 gap-px">
          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>

          <div className="col-span-full grid gap-px sm:col-span-8 @4xl:grid-cols-2">
            <div data-grid-content className="col-span-full p-6 @4xl:p-12">
              <h2 className="text-muted-foreground text-balance">Core Values</h2>
              <p className="text-foreground mt-6 max-w-2xl text-xl font-medium text-balance">
                The principles that guide every decision we make, from hiring to shipping.
              </p>
            </div>

            {values.map((value) => (
              <div
                key={value.title}
                data-grid-content
                className="flex flex-col gap-3 p-6 @4xl:p-12"
              >
                <value.icon className="text-muted-foreground size-5" />
                <h3 className="text-foreground font-medium">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div aria-hidden className="max-sm:hidden">
            <div data-grid-content />
          </div>
        </div>
      </Container>
    </section>
  );
}
