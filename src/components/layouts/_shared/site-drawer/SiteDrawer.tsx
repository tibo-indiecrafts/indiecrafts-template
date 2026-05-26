"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Logo } from "@/components/layouts/_shared/logo";
import type { NavLink } from "@/config";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";

import {
  siteDrawerDefaults,
  siteDrawerNamespace,
  type SiteDrawerButtonOpening,
  type SiteDrawerDirection,
} from "./config";

export interface SiteDrawerProps {
  items?: readonly NavLink[];

  width?: number;
  direction?: SiteDrawerDirection;
  buttonOpeningVariants?: SiteDrawerButtonOpening;

  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  showToggleButton?: boolean;

  enableDrag?: boolean;
  dragThreshold?: number;

  animationConfig?: {
    type?: "spring" | "tween";
    damping?: number;
    stiffness?: number;
    duration?: number;
  };

  className?: string;
  btnClassName?: string;
  clsBtnClassName?: string;
  contentClassName?: string;
  overlayClassName?: string;
}

function getOpenButtonVariants(
  direction: SiteDrawerDirection,
  width: number,
  type: SiteDrawerButtonOpening,
) {
  switch (type) {
    case "merge":
      return direction === "left"
        ? {
            closed: { x: 0, opacity: 1, scale: 1, borderRadius: "0.5rem" },
            open: { x: width - 68, opacity: 0, scale: 1, borderRadius: "0rem" },
          }
        : {
            closed: { x: 0, opacity: 1, scale: 1, borderRadius: "0.5rem" },
            open: { x: 68 - width, opacity: 0, scale: 1, borderRadius: "0rem" },
          };
    case "push":
      return direction === "left"
        ? { closed: { x: 0, opacity: 1 }, open: { x: width + 20, opacity: 0 } }
        : { closed: { x: 0, opacity: 1 }, open: { x: -(width + 20), opacity: 0 } };
    case "stay":
    default:
      return { closed: { x: 0, opacity: 1 }, open: { x: 0, opacity: 0 } };
  }
}

export function SiteDrawer({
  items = siteDrawerDefaults.items,
  width = siteDrawerDefaults.width,
  direction = siteDrawerDefaults.direction,
  buttonOpeningVariants = siteDrawerDefaults.buttonOpeningVariants,

  isOpen: controlledIsOpen,
  onToggle,
  showToggleButton = true,

  enableDrag = true,
  dragThreshold = 0.3,

  animationConfig = { type: "spring", damping: 25, stiffness: 120 },

  className,
  btnClassName,
  clsBtnClassName,
  contentClassName,
  overlayClassName,
}: Readonly<SiteDrawerProps>) {
  const [, , tRoot] = useScopedT(siteDrawerNamespace);
  const tNav = useTranslations("nav");
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (value: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(value);
    }
    onToggle?.(value);
  };

  const drawerVariants =
    direction === "left"
      ? { closed: { x: -width }, open: { x: 0 } }
      : { closed: { x: width }, open: { x: 0 } };

  const buttonVariants = getOpenButtonVariants(direction, width, buttonOpeningVariants);

  const dragConstraints =
    direction === "left" ? { left: -width, right: 0 } : { left: 0, right: width };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (!enableDrag) return;

    const threshold = width * dragThreshold;
    const dragDistance = Math.abs(info.offset.x);

    if (direction === "left") {
      const isDraggingLeft = info.offset.x < 0;
      if (isDraggingLeft && dragDistance > threshold && isOpen) {
        setIsOpen(false);
      } else if (!isDraggingLeft && dragDistance > threshold && !isOpen) {
        setIsOpen(true);
      }
    } else {
      const isDraggingRight = info.offset.x > 0;
      if (isDraggingRight && dragDistance > threshold && isOpen) {
        setIsOpen(false);
      } else if (!isDraggingRight && dragDistance > threshold && !isOpen) {
        setIsOpen(true);
      }
    }
  };

  const drawerPosition = direction === "left" ? "left-0" : "right-0";
  const openButtonPosition = direction === "left" ? "top-4 left-4" : "top-4 right-4";

  return (
    <>
      {showToggleButton && (
        <motion.div
          className={cn(
            "text-foreground fixed z-[99] flex items-center gap-3",
            openButtonPosition,
            btnClassName,
          )}
          variants={buttonVariants}
          animate={isOpen ? "open" : "closed"}
          transition={animationConfig}
          style={{ pointerEvents: isOpen ? "none" : "auto" }}
        >
          <motion.button
            type="button"
            aria-label={tRoot("openLabel")}
            aria-expanded={isOpen}
            className="cursor-pointer"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu aria-hidden="true" />
          </motion.button>
          <Link href="/" aria-label="Home" className="text-foreground">
            <Logo />
          </Link>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className={cn("fixed top-0 left-0 z-[9999] h-full w-full", className)}>
            <motion.div
              className={cn(
                "absolute top-0 left-0 h-full w-full bg-black/30",
                overlayClassName,
              )}
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className={cn(
                "bg-background text-foreground absolute h-full shadow-[8px_1px_21px_0px_rgba(17,17,26,0.1)]",
                drawerPosition,
                contentClassName,
              )}
              style={{
                width: `${width}px`,
                padding: "60px 30px 30px 30px",
                boxSizing: "border-box",
              }}
              drag={enableDrag ? "x" : false}
              dragElastic={0.1}
              dragConstraints={dragConstraints}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={animationConfig}
            >
              {showToggleButton && (
                <motion.button
                  type="button"
                  aria-label={tRoot("closeLabel")}
                  className={cn(
                    "text-foreground absolute top-2 right-8 cursor-pointer p-2",
                    clsBtnClassName,
                  )}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X aria-hidden="true" size={20} />
                </motion.button>
              )}

              <div className="flex h-full flex-col gap-8 overflow-y-auto">
                <Link href="/" aria-label="Home" onClick={() => setIsOpen(false)}>
                  <Logo />
                </Link>

                <nav aria-label={tRoot("primaryNavLabel")}>
                  <ul className="flex flex-col gap-3 text-base">
                    {items.map((item) => (
                      <li key={`${item.href}-${item.labelKey}`}>
                        <Link
                          href={item.href}
                          className="hover:text-muted-foreground inline-flex w-full py-1 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {tNav(item.labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
