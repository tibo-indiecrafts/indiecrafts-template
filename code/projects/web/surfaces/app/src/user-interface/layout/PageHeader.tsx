/**
 * Render a page heading with a title, optional description, and actions.
 *
 * @see docs/reference/projects/web/app/src/user-interface/layout/PageHeader.md
 */
import type { ReactNode } from "react";

/** Page-level heading: title + optional description, with optional right-aligned actions. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}
