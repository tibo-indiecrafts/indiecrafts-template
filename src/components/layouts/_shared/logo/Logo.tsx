import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type LogoIconProps = {
  className?: string;
};

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={24}
      height={24}
      unoptimized
      priority
      className={cn("size-6", className)}
    />
  );
}

type LogoProps = {
  className?: string;

  iconClassName?: string;
};

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <span className={cn("text-foreground inline-flex items-center gap-2", className)}>
      <LogoIcon className={cn("size-6", iconClassName)} />
      <span className="font-semibold">{siteConfig.name}</span>
    </span>
  );
}
