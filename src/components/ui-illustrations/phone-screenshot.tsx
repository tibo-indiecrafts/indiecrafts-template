import Image from "next/image";
import { cn } from "@/lib/utils";

const DEFAULT_SRC =
  "https://raw.githubusercontent.com/acme/assets/refs/heads/main/mobile_hwua2g.png";

export type PhoneScreenshotProps = {
  src?: string;
  alt?: string;
  className?: string;
};

/**
 * Phone-shaped frame mocking an app screenshot. The outer rounded
 * shell is the device chrome; the inner image is the screen content.
 * Used by `sections-secondary-hero/secondary-hero-13`. Mock content
 * is decorative; consumers can pass a custom `src` to swap in a real
 * screenshot.
 */
export const PhoneScreenshot = ({
  src = DEFAULT_SRC,
  alt = "App screen",
  className,
}: PhoneScreenshotProps) => (
  <div
    className={cn(
      "bg-background ring-foreground/10 h-156 max-w-84 rounded-3xl border border-transparent p-2 shadow-xl ring-1 max-md:mx-auto md:h-124 md:max-w-64",
      className,
    )}
  >
    <Image
      className="border-foreground/10 shadow-foreground/5 h-full rounded-2xl border object-cover object-top shadow"
      src={src}
      alt={alt}
      width={704}
      height={1382}
    />
  </div>
);
