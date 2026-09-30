/**
 * Render the web site-wide maintenance page.
 *
 * @see docs/reference/packages/web/system-pages/src/web/Maintenance.md
 */
import type { MaintenanceProps } from "../shared/types";

/**
 * Site-wide maintenance page. Rendered by an app's standalone `/maintenance`
 * route when maintenance is on — the build-time `features.maintenance` flag OR the
 * live Sanity `siteSettings.maintenanceMode` toggle (see `./proxy` → `maintenanceRewrite`).
 * Presentational — the route resolves the copy + brand identity and passes them
 * in. Token-based, so it inherits each app's theme.
 *
 * Signature: the status pill's pulsing dot is an honest "actively working"
 * signal (not decoration), and the page's single motion — it holds still under
 * `prefers-reduced-motion`.
 */
export function Maintenance({
  statusLabel,
  title,
  body,
  contactLabel,
  name,
  email,
}: MaintenanceProps) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-(--gutter) py-16">
      <div
        aria-hidden="true"
        className="bg-brand/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      />

      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <p className="border-border/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase">
          <span className="relative flex size-2">
            <span className="bg-brand absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:hidden" />
            <span className="bg-brand relative inline-flex size-2 rounded-full" />
          </span>
          {statusLabel}
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>

        <p className="text-muted-foreground text-lg text-pretty">{body}</p>

        {email ? (
          <p className="text-muted-foreground mt-2 text-sm">
            {contactLabel}{" "}
            <a
              href={`mailto:${email}`}
              className="text-brand focus-visible:ring-ring rounded font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              {email}
            </a>
          </p>
        ) : null}
      </div>

      <p className="text-muted-foreground absolute bottom-8 text-xs font-medium tracking-widest uppercase">
        {name}
      </p>
    </main>
  );
}
