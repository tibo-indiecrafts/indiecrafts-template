"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variant,
  type Variants,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

type DisclosureContextValue = {
  open: boolean;
  toggle: () => void;
  variants?: { expanded: Variant; collapsed: Variant };
};

const DisclosureContext = React.createContext<DisclosureContextValue | null>(null);

function useDisclosureContext(consumer: string) {
  const ctx = React.useContext(DisclosureContext);
  if (!ctx) {
    throw new Error(`${consumer} must be used within a <Disclosure>`);
  }
  return ctx;
}

export type DisclosureProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  variants?: { expanded: Variant; collapsed: Variant };
  transition?: Transition;
};

export function Disclosure({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  transition,
  variants,
}: Readonly<DisclosureProps>) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = controlledOpen ?? internalOpen;

  const toggle = () => {
    const next = !isOpen;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <MotionConfig transition={transition}>
      <div className={className}>
        <DisclosureContext.Provider value={{ open: isOpen, toggle, variants }}>
          {children}
        </DisclosureContext.Provider>
      </div>
    </MotionConfig>
  );
}

export type DisclosureTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function DisclosureTrigger({
  children,
  className,
}: Readonly<DisclosureTriggerProps>) {
  const { toggle, open } = useDisclosureContext("DisclosureTrigger");
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      className={cn("block w-full text-left", className)}
    >
      {children}
    </button>
  );
}

export type DisclosureContentProps = {
  children: React.ReactNode;
  className?: string;
};

const BASE_VARIANTS: Variants = {
  expanded: { height: "auto", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

export function DisclosureContent({
  children,
  className,
}: Readonly<DisclosureContentProps>) {
  const { open, variants } = useDisclosureContext("DisclosureContent");
  const uniqueId = React.useId();

  const combinedVariants: Variants = {
    expanded: { ...BASE_VARIANTS.expanded, ...variants?.expanded },
    collapsed: { ...BASE_VARIANTS.collapsed, ...variants?.collapsed },
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={uniqueId}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={combinedVariants}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
