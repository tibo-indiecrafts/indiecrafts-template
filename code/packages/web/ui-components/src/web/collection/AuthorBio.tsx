/**
 * Render end-of-article author cards from resolved author data.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/AuthorBio.md
 */
import Image from "next/image";

/** One author for the "Written by" block — resolved fields (bio is plain text). */
export type AuthorBioItem = {
  _key?: string;
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  href?: string;
};

/**
 * "Written by" — end-of-article author card(s): avatar, name (linked when
 * `href` is set), role, and a short bio. One block per author; entries without
 * a name are dropped, and the whole block renders `null` when none remain.
 * Data-driven (plain `<a>`, resolved `imageUrl`/`href` — the host localizes).
 *
 * `label` is the section heading (e.g. "Written by").
 */
export function AuthorBio({
  authors,
  label,
}: {
  authors: AuthorBioItem[];
  label: string;
}) {
  const people = (authors ?? []).filter((a) => a?.name);
  if (!people.length) return null;
  return (
    <section
      aria-label={label}
      className="border-border/60 mt-14 max-w-3xl border-t pt-8"
    >
      <h2 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {label}
      </h2>
      <div className="mt-5 flex flex-col gap-8">
        {people.map((a) => (
          <div key={a._key ?? a.href ?? a.name} className="flex gap-4">
            {a.imageUrl ? (
              <Image
                src={a.imageUrl}
                alt={a.name}
                width={112}
                height={112}
                className="bg-muted ring-border size-14 shrink-0 rounded-full object-cover ring-1"
              />
            ) : (
              <span className="bg-muted text-muted-foreground ring-border flex size-14 shrink-0 items-center justify-center rounded-full text-lg ring-1">
                {a.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              {a.href ? (
                <a
                  href={a.href}
                  className="text-foreground hover:text-muted-foreground focus-visible:ring-ring rounded font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {a.name}
                </a>
              ) : (
                <span className="text-foreground font-medium">{a.name}</span>
              )}
              {a.role ? (
                <p className="text-muted-foreground text-sm">{a.role}</p>
              ) : null}
              {a.bio ? (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {a.bio}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
