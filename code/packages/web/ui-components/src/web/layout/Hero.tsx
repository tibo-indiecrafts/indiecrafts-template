import type { HeroModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { RichTitle } from "../RichTitle";
import { ModuleCta } from "./Cta";
import { ModuleSection } from "./ModuleSection";

/**
 * Page hero — the lead band: eyebrow, large title (`[[…]]` accents a word in
 * brand), subtitle, optional CTA. Centered, generous vertical rhythm. Renders
 * nothing when there is no title.
 */
export function Hero({ inline, ...props }: HeroModule & { inline?: boolean }) {
  if (!props.title) return null;
  return (
    <ModuleSection
      anchor={props.anchor}
      inline={inline}
      className="py-16 text-center md:py-24"
    >
      <div className="mx-auto max-w-2xl">
        {props.eyebrow ? (
          <p className="text-brand text-xs font-medium tracking-widest uppercase">
            {props.eyebrow}
          </p>
        ) : null}
        <RichTitle
          as="h1"
          className="mt-4 text-4xl font-semibold text-balance lg:text-5xl"
        >
          {props.title}
        </RichTitle>
        {props.subtitle ? (
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-pretty">
            {props.subtitle}
          </p>
        ) : null}
        {props.cta ? (
          <div className="mt-6">
            <ModuleCta cta={props.cta} />
          </div>
        ) : null}
      </div>
    </ModuleSection>
  );
}
