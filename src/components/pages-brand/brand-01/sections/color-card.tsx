"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function ColorCard({
  name,
  hex,
  className,
}: {
  name: string;
  hex: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyHex = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div data-grid-content className="group p-1">
      <div
        className={cn(
          "inset-ring-foreground/15 relative aspect-square rounded-xl inset-ring",
          className,
        )}
        style={{ backgroundColor: hex }}
      >
        <span className="absolute top-2 left-2 text-xs font-medium duration-300 not-group-hover:opacity-0">
          {hex}
        </span>
        <span className="absolute bottom-2 left-2 text-sm font-medium duration-200">
          {name}
        </span>
        <button
          onClick={copyHex}
          className="bg-background/80 text-foreground ring-foreground/10 hover:bg-background absolute right-2 bottom-2 inline-flex size-8 origin-bottom-right items-center justify-center rounded-md text-sm ring-1 backdrop-blur-sm duration-200 not-group-hover:scale-90 not-group-hover:opacity-0 active:scale-98"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.8, opacity: 0, filter: "blur(2px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.8, opacity: 0, filter: "blur(2px)" }}
                transition={{ duration: 0.15 }}
              >
                <Check className="size-3.5" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.8, opacity: 0, filter: "blur(2px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.8, opacity: 0, filter: "blur(2px)" }}
                transition={{ duration: 0.15 }}
              >
                <Copy className="size-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Copy {hex}</span>
        </button>
      </div>
    </div>
  );
}
