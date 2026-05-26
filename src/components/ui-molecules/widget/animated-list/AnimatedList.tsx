"use client";

import { motion, useInView } from "motion/react";
import * as React from "react";

export interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

interface AnimatedItemProps {
  children: React.ReactNode;
  delay?: number;
  index: number;
  selected: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

function AnimatedItem({
  children,
  delay = 0,
  index,
  selected,
  onMouseEnter,
  onClick,
}: AnimatedItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.button
      ref={ref}
      type="button"
      data-index={index}
      aria-current={selected ? "true" : undefined}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
    >
      {children}
    </motion.button>
  );
}

const DEFAULT_ITEMS = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
];

export function AnimatedList({
  items = DEFAULT_ITEMS,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className,
  itemClassName,
  displayScrollbar = true,
  initialSelectedIndex = -1,
}: Readonly<AnimatedListProps>) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = React.useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = React.useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = React.useState(1);

  const handleItemMouseEnter = (index: number) => setSelectedIndex(index);
  const handleItemClick = (item: string, index: number) => {
    setSelectedIndex(index);
    onItemSelect?.(item, index);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1),
    );
  };

  React.useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          onItemSelect?.(items[selectedIndex], selectedIndex);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  React.useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector<HTMLElement>(
      `[data-index="${selectedIndex}"]`,
    );
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-[500px] ${className ?? ""}`}>
      <div
        ref={listRef}
        className={`max-h-[400px] overflow-y-auto p-4 ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:rounded-[4px] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-track]:bg-[#120F17]"
            : "scrollbar-hide"
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? "thin" : "none",
          scrollbarColor: "#222 #120F17",
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            selected={selectedIndex === index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            <div
              className={`rounded-lg bg-[#111] p-4 ${selectedIndex === index ? "bg-[#222]" : ""} ${itemClassName ?? ""}`}
            >
              <p className="m-0 text-white">{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="ease pointer-events-none absolute top-0 right-0 left-0 h-[50px] bg-gradient-to-b from-[#120F17] to-transparent transition-opacity duration-300"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="ease pointer-events-none absolute right-0 bottom-0 left-0 h-[100px] bg-gradient-to-t from-[#120F17] to-transparent transition-opacity duration-300"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
}
