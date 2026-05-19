"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

const DEFAULT_MASK_SVG =
  "url(\"data:image/svg+xml,%3Csvg width='221' height='122' viewBox='0 0 221 122' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M183 4C183 1.79086 184.791 0 187 0H217C219.209 0 221 1.79086 221 4V14V28V99C221 101.209 219.209 103 217 103H182C179.791 103 178 104.791 178 107V118C178 120.209 176.209 122 174 122H28C25.7909 122 24 120.209 24 118V103V94V46C24 43.7909 22.2091 42 20 42H4C1.79086 42 0 40.2091 0 38V18C0 15.7909 1.79086 14 4 14H24H43H179C181.209 14 183 12.2091 183 10V4Z' fill='%23D9D9D9'/%3E%3C/svg%3E%0A\")";

const DEFAULT_SRC =
  "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=2070&auto=format&fit=crop";

export interface ImageMaskingProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  src?: string;
  alt?: string;
  aspectRatio?: React.CSSProperties["aspectRatio"];
  fallbackColor?: string;
  maskImage?: string;
  imageClassName?: string;
  sizes?: string;
}

export function ImageMasking({
  src = DEFAULT_SRC,
  alt = "",
  aspectRatio = "1213/667",
  fallbackColor = "tomato",
  maskImage = DEFAULT_MASK_SVG,
  className,
  imageClassName,
  sizes = "(min-width: 1280px) 1213px, 100vw",
  ...props
}: Readonly<ImageMaskingProps>) {
  return (
    <section
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio,
        backgroundColor: fallbackColor,
        maskImage,
        WebkitMaskImage: maskImage,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          "object-cover transition-transform duration-300 hover:scale-105",
          imageClassName,
        )}
      />
    </section>
  );
}
