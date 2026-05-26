import type { BreadcrumbsModule } from "@/sanity/types";

export function Breadcrumbs(props: BreadcrumbsModule) {
  if (!props.items?.length) return null;
  return (
    <nav
      id={props.anchor}
      aria-label="Breadcrumb"
      className="mx-auto max-w-6xl px-(--gutter) pt-6 text-sm"
    >
      <ol className="text-muted-foreground flex flex-wrap items-center gap-2">
        {props.items.map((item, i) => {
          const isLast = i === props.items!.length - 1;
          return (
            <li key={item._key} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="hover:text-foreground underline-offset-2 hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
