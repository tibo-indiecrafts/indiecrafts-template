import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials13Namespace } from "./config";
import type { TestimonialItem, TestimonialsBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pt-6", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 pb-6", className)} {...props} />
);

export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials13Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 id={headingId} className="text-4xl font-medium lg:text-5xl">
            {tRoot(props.titleKey)}
          </h2>
          <p>{tRoot(props.bodyKey)}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
            <CardHeader>
              <Hulu height={18} width={56} className="**:fill-foreground" />
            </CardHeader>
            <CardContent>
              <Quote item={props.featured} tRoot={tRoot} large />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="h-full pt-6">
              <Quote item={props.others[0]} tRoot={tRoot} large />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="h-full pt-6">
              <Quote item={props.others[1]} tRoot={tRoot} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="h-full pt-6">
              <Quote item={props.others[2]} tRoot={tRoot} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const Quote = ({
  item,
  tRoot,
  large = false,
}: {
  item: TestimonialItem;
  tRoot: (key: TestimonialItem["nameKey"]) => string;
  large?: boolean;
}) => {
  const name = tRoot(item.nameKey);
  return (
    <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
      <p className={large ? "text-xl font-medium" : ""}>{tRoot(item.contentKey)}</p>

      <div className="grid grid-cols-[auto_1fr] items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={item.avatarUrl} alt={name} loading="lazy" />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <cite className="text-sm font-medium">{name}</cite>
          <span className="text-muted-foreground block text-sm">
            {tRoot(item.roleKey)}
          </span>
        </div>
      </div>
    </blockquote>
  );
};
