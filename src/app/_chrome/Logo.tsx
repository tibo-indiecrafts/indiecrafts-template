import Image from "next/image";
import { site } from "@/config";
import { cn } from "@/lib/utils";

type LogoIconProps = {
  className?: string;
};

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <Image
      src={site.logo}
      alt={site.name}
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
      <span className="font-semibold">{site.name}</span>
    </span>
  );
}
