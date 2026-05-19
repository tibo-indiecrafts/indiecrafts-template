"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const DEFAULT_MASK_SVG =
  "url(\"data:image/svg+xml,%3Csvg width='221' height='122' viewBox='0 0 221 122' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fillRule='evenodd' clipRule='evenodd' d='M183 4C183 1.79086 184.791 0 187 0H217C219.209 0 221 1.79086 221 4V14V28V99C221 101.209 219.209 103 217 103H182C179.791 103 178 104.791 178 107V118C178 120.209 176.209 122 174 122H28C25.7909 122 24 120.209 24 118V103V94V46C24 43.7909 22.2091 42 20 42H4C1.79086 42 0 40.2091 0 38V18C0 15.7909 1.79086 14 4 14H24H43H179C181.209 14 183 12.2091 183 10V4Z' fill='%23D9D9D9'/%3E%3C/svg%3E%0A\")";

const DEFAULT_SRC =
  "https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4";

export interface VideoMaskingProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  src?: string;
  poster?: string;
  aspectRatio?: React.CSSProperties["aspectRatio"];
  fallbackColor?: string;
  maskImage?: string;
  videoClassName?: string;
}

export function VideoMasking({
  src = DEFAULT_SRC,
  poster,
  aspectRatio = "1213/667",
  fallbackColor = "tomato",
  maskImage = DEFAULT_MASK_SVG,
  className,
  videoClassName,
  ...props
}: Readonly<VideoMaskingProps>) {
  return (
    <section
      className={cn("relative", className)}
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
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        aria-hidden="true"
        className={cn("absolute inset-0 h-full w-full object-cover", videoClassName)}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" />
      </video>
    </section>
  );
}
