import { getTranslations } from "next-intl/server";
import type { FormModule as FormModuleProps } from "@/sanity/types";

/**
 * Renders an editor-defined form. Submits to Netlify Forms via the form
 * `name` field — must match a `<form>` declaration in
 * `public/__forms.html` for Netlify's build-time scanner to pick it up.
 *
 * No client-side JS — Netlify intercepts the standard POST and routes
 * by the hidden `form-name` input. A honeypot `bot-field` is included.
 */
export async function FormModule(props: FormModuleProps) {
  const form = props.form;
  if (!form?.name) return null;
  const t = await getTranslations("pages.blog");
  const title = props.title ?? form.title;
  const intro = props.intro ?? form.intro;
  const submit = form.submitLabel ?? t("formSubmitDefault");

  return (
    <section id={props.anchor} className="mx-auto max-w-2xl px-(--gutter) py-12 md:py-20">
      {title ? <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2> : null}
      {intro ? <p className="text-muted-foreground mt-2">{intro}</p> : null}

      <form
        name={form.name}
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        action="/"
        className="mt-6 flex flex-col gap-4"
      >
        <input type="hidden" name="form-name" value={form.name} />
        <p className="hidden">
          <label>
            {t("formHoneypot")} <input name="bot-field" />
          </label>
        </p>

        {form.fields?.map((f) => (
          <label key={f._key} className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">
              {f.label}
              {f.required ? <span className="text-destructive ml-0.5">*</span> : null}
            </span>
            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                required={f.required}
                rows={5}
                className="bg-background ring-border focus-visible:ring-ring rounded-md px-3 py-2 ring-1 focus-visible:ring-2 focus-visible:outline-none"
              />
            ) : (
              <input
                type={f.type ?? "text"}
                name={f.name}
                required={f.required}
                className="bg-background ring-border focus-visible:ring-ring h-10 rounded-md px-3 ring-1 focus-visible:ring-2 focus-visible:outline-none"
              />
            )}
          </label>
        ))}

        <button
          type="submit"
          className="bg-foreground text-background hover:bg-foreground/90 mt-2 h-10 rounded-md px-5 text-sm font-medium shadow-sm"
        >
          {submit}
        </button>
      </form>
    </section>
  );
}
