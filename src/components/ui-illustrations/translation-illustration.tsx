/**
 * Translation-pair illustration — a masked source paragraph (Latin
 * lorem-ipsum body text), an "Auto translated from English" label
 * with gradient-clipped text, and a primary-ringed Spanish
 * translation card showing the rendered output. Pure decoration; mock
 * copy stays hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/features-carousel-1` (the upstream's
 * `TranslationInterfaceIllustration`).
 */
export const TranslationIllustration = () => {
  return (
    <div aria-hidden className="max-w-xs min-w-xs">
      <div className="space-y-3">
        <div className="mask-y-from-35%">
          <p className="text-sm/6">
            Corporis voluptates voluptatem atque excepturi, tempore dolor distinctio
            libero dicta vel, nihil rem consequatur esse aspernatur nostrum, minus magnam
            labore quas optio?
          </p>
        </div>

        <div className="relative flex w-fit items-center gap-1">
          <span className="from-primary rounded bg-linear-to-r to-emerald-500 bg-clip-text text-sm text-transparent">
            Auto translated from English
          </span>
        </div>

        <div className="bg-illustration ring-primary/50 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5">
          <div className="text-muted-foreground mb-3 text-xs">Spanish</div>
          <p className="text-foreground text-sm/6">
            Hola, ¿cómo puedo ayudarte hoy? Estoy aquí para responder cualquier pregunta
            que tengas sobre nuestros servicios y productos.
          </p>
        </div>
      </div>
    </div>
  );
};
