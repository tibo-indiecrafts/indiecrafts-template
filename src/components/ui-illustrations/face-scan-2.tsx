"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

export const FaceScan2Illustration = () => {
  return (
    <div
      aria-hidden
      className="group relative [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
    >
      <div className="group relative">
        <div className="absolute inset-x-17 top-1/4 bottom-1/4 z-1 mx-auto rounded border border-white/10 bg-white/15 bg-radial from-sky-500/25 to-transparent">
          <CardDecorator className="animate-breathing" />
        </div>
        <div className="aspect-square size-56">
          <Image
            src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/human-face_kf9mt7.png"
            alt="Woman face"
            className="inverted size-full object-cover contrast-105 grayscale"
            width={224}
            height={224}
          />
        </div>

        <div className="absolute inset-0 isolate mix-blend-plus-lighter duration-300">
          <motion.div
            initial={{ opacity: 0.5, maskSize: "100% 0%" }}
            animate={{ opacity: 1, maskSize: ["100% 0%", "100% 100%", "100% 500%"] }}
            transition={{
              opacity: { duration: 0.75, delay: 2 },
              maskSize: { duration: 5, delay: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-0 aspect-square size-56 max-w-xs bg-[url('https://raw.githubusercontent.com/acme/assets/refs/heads/main/human-wire-face_lryi6q.png')] mask-[url('https://raw.githubusercontent.com/acme/assets/refs/heads/main/mask-bg_v7vpk7.png')] bg-cover bg-[50%_50%] bg-no-repeat mask-no-repeat group-hover:opacity-95"
          />
        </div>
      </div>
    </div>
  );
};

export const CardDecorator = ({ className }: { className?: string }) => (
  <>
    <span
      className={cn(
        "absolute -top-px -left-px block size-2 rounded-tl border-t-[1.5px] border-l-[1.5px] border-white",
        className,
      )}
    ></span>
    <span
      className={cn(
        "absolute -top-px -right-px block size-2 rounded-tr border-t-[1.5px] border-r-[1.5px] border-white",
        className,
      )}
    ></span>
    <span
      className={cn(
        "absolute -bottom-px -left-px block size-2 rounded-bl border-b-[1.5px] border-l-[1.5px] border-white",
        className,
      )}
    ></span>
    <span
      className={cn(
        "absolute -right-px -bottom-px block size-2 rounded-br border-r-[1.5px] border-b-[1.5px] border-white",
        className,
      )}
    ></span>
  </>
);

export default FaceScan2Illustration;
