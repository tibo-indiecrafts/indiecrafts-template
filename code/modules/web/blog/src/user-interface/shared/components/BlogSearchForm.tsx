import { Search } from "lucide-react";

/**
 * Blog search box — a plain GET form, no client JS. Submitting navigates to
 * `action?q=…`, so results render server-side and the URL is shareable. Used
 * on the frontpage and the `/blog/search` results page. `action` is a
 * locale-prefixed path (the caller passes `localizedPathname("/blog/search")`).
 */
export function BlogSearchForm({
  action,
  defaultValue,
  labels,
}: {
  action: string;
  defaultValue?: string;
  labels: { label: string; placeholder: string; submit: string };
}) {
  return (
    <form
      action={action}
      method="get"
      role="search"
      className="mx-auto flex w-full max-w-xl items-center gap-2"
    >
      <label htmlFor="blog-search" className="sr-only">
        {labels.label}
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <input
          id="blog-search"
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={labels.placeholder}
          className="bg-background ring-border focus-visible:ring-ring h-11 w-full rounded-lg pr-4 pl-9 text-sm ring-1 transition focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:ring-ring inline-flex h-11 items-center rounded-lg px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {labels.submit}
      </button>
    </form>
  );
}
