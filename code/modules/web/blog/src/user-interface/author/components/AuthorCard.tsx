import Image from "next/image";
import { Link } from "@indiecrafts/packages-web-i18n";
import type { Author, AuthorRef } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Author profile card — used by /author and the home Top Authors section.
 * Accepts either a full Author document or the lightweight AuthorRef.
 */
export function AuthorCard({
  author,
  postsLabel,
}: {
  author: AuthorRef | Author;
  postsLabel?: string;
}) {
  const slug = author.slug ?? "";
  const url = slug ? `/author/${slug}` : "/author";
  const postCount = "postCount" in author ? author.postCount : undefined;

  return (
    <article className="bg-card ring-border/60 group flex flex-col items-center gap-4 rounded-xl px-8 py-6 text-center shadow-sm ring-1 transition hover:scale-[1.01] hover:shadow-md">
      <Link
        href={url}
        className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none"
      >
        {author.image?.asset?.url ? (
          <Image
            src={author.image.asset.url}
            alt={author.name ?? ""}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <span className="bg-muted text-muted-foreground flex h-20 w-20 items-center justify-center rounded-full text-2xl">
            {(author.name ?? "?").slice(0, 1).toUpperCase()}
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-center gap-1">
          <Link
            href={url}
            className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
          >
            <h3 className="font-semibold">{author.name}</h3>
          </Link>
          {author.position ? (
            <p className="text-muted-foreground text-xs">{author.position}</p>
          ) : null}
        </div>
        {author.bio ? (
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {author.bio}
          </p>
        ) : null}
        {postCount != null && postsLabel ? (
          <p className="text-muted-foreground mt-2 text-xs">
            {postsLabel.replace("{count}", String(postCount))}
          </p>
        ) : null}
      </div>
    </article>
  );
}
