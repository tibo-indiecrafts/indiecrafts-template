"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { callAgent } from "@indiecrafts/packages-shared-agent-client";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Textarea } from "@indiecrafts/packages-web-ui/web/textarea";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import {
  TurnstileWidget,
  turnstileActive,
} from "@indiecrafts/packages-web-ui-components/web/form/TurnstileWidget";

type Idea = {
  topic: string;
  reader: string;
  problem: string;
  intent: string;
  headline: string;
  why: string;
};
type Status = "idle" | "submitting" | "done" | "error";

/**
 * Demo UI for the shared AI agent — posts a goal to the agent Worker (`NEXT_PUBLIC_AGENT_URL`)
 * and renders the returned ideas **for human review** (the article's human-in-the-loop:
 * a draft, never an action). Every string comes from `messages/<locale>.json`; the
 * active locale is sent so the agent writes its output in the visitor's language.
 */
export function ContentResearchAgent() {
  const t = useTranslations("agent");
  const locale = useLocale();
  const [context, setContext] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [tsToken, setTsToken] = useState<string | null>(null);
  const [tsKey, setTsKey] = useState(0);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    const result = await callAgent<{ ideas?: Idea[] }>(
      "content-research",
      { context, locale },
      {
        urlPrefix: `${process.env.NEXT_PUBLIC_AGENT_URL ?? ""}/v1/agent`,
        extraBody: tsToken ? { "cf-turnstile-response": tsToken } : undefined,
      },
    );
    if (!result.ok) {
      setStatus("error");
      setTsToken(null);
      setTsKey((k) => k + 1);
      return;
    }
    setIdeas(result.data.ideas ?? []);
    setStatus("done");
  }

  const FIELDS: (keyof Idea)[] = ["reader", "problem", "intent", "headline", "why"];

  return (
    <section aria-labelledby="agent-heading" className="mx-auto max-w-2xl">
      <h2 id="agent-heading" className="text-xl font-semibold md:text-2xl">
        {t("title")}
      </h2>
      <p className="text-muted-foreground mt-2 text-pretty">{t("description")}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <Label htmlFor="agent-context">{t("goalLabel")}</Label>
        <Textarea
          id="agent-context"
          required
          maxLength={2000}
          rows={3}
          placeholder={t("goalPlaceholder")}
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <TurnstileWidget key={tsKey} onToken={setTsToken} />
        <Button
          type="submit"
          disabled={
            status === "submitting" || !context.trim() || (turnstileActive() && !tsToken)
          }
        >
          {status === "submitting" ? t("submitting") : t("submit")}
        </Button>
      </form>

      {status === "error" ? (
        <p role="alert" className="text-destructive mt-4 text-sm">
          {t("error")}
        </p>
      ) : null}

      {status === "done" ? (
        ideas.length ? (
          <div className="mt-8">
            <p className="text-muted-foreground mb-4 text-sm">{t("reviewNote")}</p>
            <ul className="space-y-4">
              {ideas.map((idea, i) => (
                <li key={i} className="ring-border/60 rounded-lg p-4 shadow-sm ring-1">
                  <h3 className="font-medium">{idea.headline || idea.topic}</h3>
                  <dl className="mt-2 space-y-1 text-sm">
                    {FIELDS.map((f) => (
                      <div key={f} className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">
                          {t(`field.${f}`)}
                        </dt>
                        <dd>{idea[f]}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm">{t("empty")}</p>
        )
      ) : null}
    </section>
  );
}
