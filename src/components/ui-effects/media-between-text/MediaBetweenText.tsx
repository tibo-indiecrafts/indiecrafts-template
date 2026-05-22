"use client";

import { motion, useInView, type UseInViewOptions, type Variants } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

export type MediaBetweenTextElement = keyof typeof motionElements;

export type MediaBetweenTextTrigger = "hover" | "ref" | "inView";

export interface MediaBetweenTextProps {
  firstText: string;
  secondText: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  mediaContainerClassName?: string;
  fallbackUrl?: string;
  as?: MediaBetweenTextElement;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  alt?: string;
  triggerType?: MediaBetweenTextTrigger;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  useInViewOptionsProp?: UseInViewOptions;
  animationVariants?: {
    initial: Variants["initial"];
    animate: Variants["animate"];
  };
  className?: string;
  leftTextClassName?: string;
  rightTextClassName?: string;
}

export interface MediaBetweenTextRef {
  animate: () => void;
  reset: () => void;
}

const DEFAULT_VARIANTS = {
  initial: { width: 0, opacity: 1 },
  animate: {
    width: "auto",
    opacity: 1,
    transition: { duration: 0.4, type: "spring" as const, bounce: 0 },
  },
};

export const MediaBetweenText = React.forwardRef<
  MediaBetweenTextRef,
  MediaBetweenTextProps
>(function MediaBetweenText(
  {
    firstText,
    secondText,
    mediaUrl,
    mediaType,
    mediaContainerClassName,
    fallbackUrl,
    as = "p",
    autoPlay = true,
    loop = true,
    muted = true,
    playsInline = true,
    alt,
    triggerType = "hover",
    containerRef,
    useInViewOptionsProp,
    animationVariants = DEFAULT_VARIANTS,
    className,
    leftTextClassName,
    rightTextClassName,
  },
  ref,
) {
  const componentRef = React.useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // useInView must be called unconditionally (rules of hooks). Its result is
  // simply ignored when triggerType !== "inView".
  const inViewOptions = useInViewOptionsProp ?? {
    once: true,
    amount: 0.5,
    root: containerRef,
  };
  const isInViewRaw = useInView(componentRef, inViewOptions);
  const isInView = triggerType === "inView" ? isInViewRaw : false;

  React.useImperativeHandle(
    ref,
    () => ({
      animate: () => setIsAnimating(true),
      reset: () => setIsAnimating(false),
    }),
    [],
  );

  let shouldAnimate = false;
  if (triggerType === "hover") shouldAnimate = isHovered;
  else if (triggerType === "inView") shouldAnimate = isInView;
  else if (triggerType === "ref") shouldAnimate = isAnimating;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- motion element union resolves to a generic forwardRef that TS can't construct without `any`
  const TextComponent = motionElements[as] as React.ComponentType<any>;

  return (
    <div
      className={cn("flex", className)}
      ref={componentRef}
      onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
      onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
    >
      <TextComponent layout className={leftTextClassName}>
        {firstText}
      </TextComponent>
      <motion.div
        className={mediaContainerClassName}
        variants={animationVariants}
        initial="initial"
        animate={shouldAnimate ? "animate" : "initial"}
      >
        {mediaType === "video" ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption -- decorative inline media; no spoken/captionable content
          <video
            className="h-full w-full object-cover"
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            poster={fallbackUrl}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs; next/image needs a remote-pattern config callers can't always satisfy
          <img
            src={mediaUrl}
            alt={alt ?? `${firstText} ${secondText}`}
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>
      <TextComponent layout className={rightTextClassName}>
        {secondText}
      </TextComponent>
    </div>
  );
});
