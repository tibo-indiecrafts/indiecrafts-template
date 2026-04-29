import { useTranslations } from "next-intl";
import { Button } from "@/components/ui-primitives/button";
import { Card } from "@/components/ui-primitives/card";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { Textarea } from "@/components/ui-primitives/textarea";
import type { Contact1Block } from "./schema";

export default function Contact1(props: Readonly<Contact1Block>) {
  const t = useTranslations();

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-4xl px-(--gutter)">
        <h2
          id={`${props.id}-title`}
          className="mb-12 text-center text-4xl font-semibold text-balance lg:text-5xl"
        >
          {t(props.titleKey)}
        </h2>

        <div className="grid divide-y border md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0">
          {props.channels.map((channel, i) => (
            <div key={i} className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
              <div>
                <h3 className="mb-3 text-lg font-semibold">{t(channel.titleKey)}</h3>
                <a
                  href={`mailto:${channel.email}`}
                  className="text-primary text-lg hover:underline"
                >
                  {channel.email}
                </a>
                {channel.phone ? <p className="mt-3 text-sm">{channel.phone}</p> : null}
              </div>
            </div>
          ))}
        </div>

        <div className="h-3 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]" />
        <form className="border px-4 py-12 lg:px-0 lg:py-24">
          <Card className="mx-auto max-w-lg p-8 sm:p-16">
            <h3 className="text-xl font-semibold">{t(props.formTitleKey)}</h3>
            <p className="text-muted-foreground mt-4 text-sm">{t(props.formIntroKey)}</p>

            <div className="mt-12 space-y-6 *:space-y-3 **:[&>label]:block">
              <div>
                <Label htmlFor={`${props.id}-name`}>{t(props.nameLabelKey)}</Label>
                <Input type="text" id={`${props.id}-name`} name="name" required />
              </div>
              <div>
                <Label htmlFor={`${props.id}-email`}>{t(props.emailLabelKey)}</Label>
                <Input type="email" id={`${props.id}-email`} name="email" required />
              </div>
              <div>
                <Label htmlFor={`${props.id}-country`}>{t(props.countryLabelKey)}</Label>
                <Select name="country">
                  <SelectTrigger id={`${props.id}-country`}>
                    <SelectValue placeholder={t(props.countryPlaceholderKey)} />
                  </SelectTrigger>
                  <SelectContent>
                    {props.countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {t(c.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`${props.id}-website`}>{t(props.websiteLabelKey)}</Label>
                <Input type="url" id={`${props.id}-website`} name="website" />
              </div>
              <div>
                <Label htmlFor={`${props.id}-job`}>{t(props.jobLabelKey)}</Label>
                <Select name="job">
                  <SelectTrigger id={`${props.id}-job`}>
                    <SelectValue placeholder={t(props.jobPlaceholderKey)} />
                  </SelectTrigger>
                  <SelectContent>
                    {props.jobs.map((j) => (
                      <SelectItem key={j.value} value={j.value}>
                        {t(j.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`${props.id}-msg`}>{t(props.messageLabelKey)}</Label>
                <Textarea id={`${props.id}-msg`} name="message" rows={3} />
              </div>
              <Button type="submit">{t(props.submitKey)}</Button>
            </div>
          </Card>
        </form>
      </div>
    </section>
  );
}
