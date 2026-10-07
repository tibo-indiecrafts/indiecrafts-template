-- Anonymous blog post-view counter — feeds the website's "Trending" block. No personal
-- data: a page view adds 1 to a per-post, per-locale, per-day counter. No IP, no user id,
-- no cookie. The only writer is POST /v1/views (the website server); GET /v1/views/top reads
-- it. The cron's main purge deletes rows older than 90 days. Forward-only (D1 has no
-- down-migrations). idx_post_views_locale_day serves the top query's locale + window scan.
CREATE TABLE post_views (
  post_id  TEXT NOT NULL,               -- Sanity document id (published, never drafts.*)
  locale   TEXT NOT NULL,               -- e.g. en, fr
  day      TEXT NOT NULL,               -- YYYY-MM-DD (UTC)
  views    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, locale, day)
);
CREATE INDEX idx_post_views_locale_day ON post_views (locale, day);
