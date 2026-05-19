"use client";

import { MoveUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";

import { bento15Namespace } from "./config";
import type { BentoBlock } from "./schema";

function spanClass(index: number, total: number) {
  if (index === 0) return "sm:col-span-5 col-span-12";
  if (index === 1) return "sm:col-span-7 col-span-12";
  if (index === total - 2) return "sm:col-span-7 col-span-12";
  if (index === total - 1) return "sm:col-span-5 col-span-12";
  return "sm:col-span-6 col-span-12";
}

export default function Bento(props: Readonly<BentoBlock>) {
  const [, , tRoot] = useScopedT(bento15Namespace);
  const total = props.items.length;

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background py-12 lg:py-20"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        {tRoot(props.titleKey)}
      </h2>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-4 px-5 pb-2 lg:pb-5">
        {props.items.map((item, index) => (
          <motion.article
            key={item.titleKey}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut" }}
            viewport={{ once: false }}
            className={cn("relative", spanClass(index, total))}
          >
            <div className="h-full w-auto">
              <Image
                src={item.image}
                alt=""
                height={600}
                width={1200}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            <div className="absolute bottom-0 flex w-full items-center justify-between p-4 lg:bottom-2">
              <h3 className="bg-foreground text-background rounded-xl p-2 px-4 text-sm lg:text-xl">
                {tRoot(item.titleKey)}
              </h3>
              <div className="bg-foreground text-background grid h-10 w-10 place-content-center rounded-full lg:h-12 lg:w-12">
                <MoveUpRight aria-hidden="true" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
