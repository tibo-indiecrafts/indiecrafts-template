"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TextScramble } from "@/components/ui-effects/text-scramble";
import { cn } from "@/lib/utils";
import { LightDarkParticles } from "@/components/ui-effects/light-dark-particles";
import Image from "next/image";

export const FaceScanIllustration = () => {
  const [show, setShow] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);

      const hideTimer = setTimeout(() => {
        setShow(false);
        setShowName(true);
      }, 100);

      return () => clearTimeout(hideTimer);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div aria-hidden className="group relative m-auto size-fit">
      <div
        className="absolute -inset-6 z-10 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] mix-blend-screen not-dark:opacity-25"
        style={{
          backgroundImage: `
        linear-gradient(to right, #000 1px, transparent 1px),
        linear-gradient(to bottom, #000 1px, transparent 1px)
      `,
          backgroundSize: "5px 5px",
        }}
      />

      <div className="absolute inset-0 animate-spin opacity-50 blur-lg duration-[3s] dark:opacity-20">
        <div className="animate-hue-rotate absolute inset-0 rounded-full bg-linear-to-r/increasing from-pink-300 to-indigo-300" />
      </div>
      <div className="animate-scan absolute inset-x-12 inset-y-0 z-10">
        <div className="absolute inset-x-0 m-auto h-6 rounded-full bg-white/50 blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5, type: "spring" }}
        className="absolute inset-0 z-10 m-auto aspect-2/3 w-24"
      >
        <CardDecorator className="scale-125 border-white blur-[3px]" />
        <motion.div
          initial={{ "--frame-color": "white" }}
          animate={{ "--frame-color": "var(--color-lime-400)" }}
          transition={{ duration: 0.4, delay: 3.5, type: "spring" }}
        >
          <CardDecorator className="z-10 border-(--frame-color)" />
        </motion.div>
        <LightDarkParticles id="light-dark-particles" />
      </motion.div>

      {show && (
        <div className="absolute inset-0 z-10 scale-150 rounded-full bg-white mix-blend-overlay blur-xl" />
      )}

      <div className="aspect-square max-w-xs bg-radial [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] group-hover:opacity-95">
        <Image
          src="https://raw.githubusercontent.com/tailark/assets/refs/heads/main/human-face_kf9mt7.png"
          alt="woman face"
          className="bg-illustration size-full object-cover grayscale"
          width={560}
          height={560}
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-4 z-10 mx-auto flex h-4 justify-center"
      >
        {showName && (
          <TextScramble className="text-center font-mono text-sm text-white uppercase">
            Anna Johnson
          </TextScramble>
        )}
      </div>
    </div>
  );
};

export const CardDecorator = ({ className }: { className?: string }) => (
  <>
    <span
      className={cn(
        "absolute -top-px -left-px block size-2.5 border-t-[1.5px] border-l-[1.5px] border-white",
        className,
      )}
    ></span>
    <span
      className={cn(
        "absolute -top-px -right-px block size-2.5 border-t-[1.5px] border-r-[1.5px] border-white",
        className,
      )}
    ></span>
    <span
      className={cn(
        "absolute -bottom-px -left-px block size-2.5 border-b-[1.5px] border-l-[1.5px] border-white",
        className,
      )}
    ></span>
    <span
      className={cn(
        "absolute -right-px -bottom-px block size-2.5 border-r-[1.5px] border-b-[1.5px] border-white",
        className,
      )}
    ></span>
  </>
);

export default FaceScanIllustration;
