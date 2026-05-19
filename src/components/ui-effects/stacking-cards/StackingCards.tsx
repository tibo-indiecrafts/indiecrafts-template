"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface StackingCardItem {
  title: string;
  description: string;
  image: string;
  color: string;
  href?: string;
}

export interface StackingCardsProps {
  items: StackingCardItem[];
  className?: string;
  seeMoreLabel?: string;
}

export function StackingCards({
  items,
  className,
  seeMoreLabel = "See more",
}: Readonly<StackingCardsProps>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className={cn("relative w-full bg-slate-950 text-white", className)}
    >
      {items.map((item, i) => {
        const targetScale = 1 - (items.length - i) * 0.05;
        return (
          <StackingCard
            key={`${i}-${item.title}`}
            index={i}
            item={item}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
            seeMoreLabel={seeMoreLabel}
          />
        );
      })}
    </section>
  );
}

interface StackingCardProps {
  index: number;
  item: StackingCardItem;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  seeMoreLabel: string;
}

function StackingCard({
  index,
  item,
  progress,
  range,
  targetScale,
  seeMoreLabel,
}: Readonly<StackingCardProps>) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={cardRef} className="sticky top-0 flex h-screen items-center justify-center">
      <motion.div
        style={{
          backgroundColor: item.color,
          scale,
          top: `calc(-5vh + ${index * 25}px)`,
        }}
        className="relative -top-[25%] flex h-[450px] w-[70%] origin-top flex-col rounded-md p-2 sm:p-4 lg:p-10"
      >
        <h3 className="text-center text-2xl font-semibold">{item.title}</h3>
        <div className="mt-5 flex h-full gap-10">
          <div className="relative top-[10%] w-[40%]">
            <p className="text-sm">{item.description}</p>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 underline"
              >
                {seeMoreLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <div className="relative h-full w-[60%] overflow-hidden rounded-lg">
            <motion.div className="h-full w-full" style={{ scale: imageScale }}>
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
