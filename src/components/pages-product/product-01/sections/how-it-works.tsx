import { Container } from "@/components/ui-effects/grid-2-product-container";
import {
  FeatureCard,
  FeatureCardDescription,
  FeatureCardCIllustration,
  FeatureCardContent,
  FeatureCardTitle,
} from "@/components/ui-effects/grid-2-product-feature-card";
import { CalendarIllustration } from "@/components/ui-illustrations/grid-2-product-calendar";
import { WalletIllustration } from "@/components/ui-illustrations/grid-2-product-wallet-illustration";
import { TaskPlanningIllustration } from "@/components/ui-illustrations/grid-2-product-task-planning-illustration";

export default function HowItWorksSection() {
  return (
    <section className="[--color-primary:var(--color-indigo-500)]">
      <Container className="py-16 lg:py-24">
        <div className="mx-auto max-w-2xl space-y-6 px-6 text-center">
          <h2 className="text-foreground text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
            Simple 3 Step Workflow
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            Experience our streamlined approach to data analysis that empowers your team
            to make informed decisions quickly and efficiently.
          </p>
        </div>
      </Container>
      <Container asGrid className="@2xl:grid-cols-4 @5xl:grid @5xl:grid-cols-3">
        <div className="@max-2xl:hidden @5xl:hidden">
          <div data-grid-content />
        </div>

        <div className="grid gap-px @2xl:col-span-2 @5xl:col-span-full @5xl:grid-cols-3">
          <FeatureCard className="@max-5xl:h-auto">
            <FeatureCardContent>
              <FeatureCardTitle>
                <span className="font-mono">01.</span> Launch
              </FeatureCardTitle>
              <FeatureCardDescription>
                <span className="text-foreground">Get started in minutes.</span> Set up
                your workspace and invite team members.
              </FeatureCardDescription>
            </FeatureCardContent>
            <FeatureCardCIllustration className="@4xl:px-10">
              <CalendarIllustration />
            </FeatureCardCIllustration>
          </FeatureCard>

          <FeatureCard className="@max-5xl:h-auto">
            <FeatureCardContent>
              <FeatureCardTitle>
                <span className="font-mono">02.</span> Analyze
              </FeatureCardTitle>
              <FeatureCardDescription>
                <span className="text-foreground">Gain actionable insights.</span> Our
                AI-powered analytics engine processes your data.
              </FeatureCardDescription>
            </FeatureCardContent>
            <FeatureCardCIllustration>
              <WalletIllustration />
            </FeatureCardCIllustration>
          </FeatureCard>

          <FeatureCard className="@max-5xl:h-auto">
            <FeatureCardContent>
              <FeatureCardTitle>
                <span className="font-mono">03.</span> Plan
              </FeatureCardTitle>
              <FeatureCardDescription>
                <span className="text-foreground">Execute with precision.</span> Transform
                insights into strategic action plans.
              </FeatureCardDescription>
            </FeatureCardContent>
            <FeatureCardCIllustration>
              <TaskPlanningIllustration />
            </FeatureCardCIllustration>
          </FeatureCard>
        </div>
        <div className="@max-2xl:hidden @5xl:hidden">
          <div data-grid-content />
        </div>
      </Container>
    </section>
  );
}
