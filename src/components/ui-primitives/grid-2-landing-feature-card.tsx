import { cn } from "@/lib/utils";

export const FeatureCard = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="feature-card"
      className={cn("grid h-full grid-rows-[auto_1fr] gap-px", className)}
      {...props}
    />
  );
};

export const FeatureCardContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-grid-content
      data-slot="feature-card-content"
      className={cn("space-y-4 p-6 @4xl:px-12 @4xl:pt-12", className)}
      {...props}
    />
  );
};

export const FeatureCardCIllustration = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-grid-content
      data-slot="feature-card-illustration"
      className={cn(
        "flex flex-col items-center justify-center px-6 pt-6 pb-6 @4xl:px-12 @4xl:pb-12",
        className,
      )}
      {...props}
    />
  );
};

export const FeatureCardTitle = ({ className, ...props }: React.ComponentProps<"h3">) => {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content -- children supplied by caller via {...props}
    <h3
      data-slot="feature-card-title"
      className={cn("text-muted-foreground flex items-center gap-2", className)}
      {...props}
    />
  );
};

export const FeatureCardDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      data-slot="feature-card-description"
      className={cn("text-muted-foreground text-xl font-medium", className)}
      {...props}
    />
  );
};
