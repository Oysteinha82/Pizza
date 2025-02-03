"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface SectionHeaderProps {
  emoji?: string;
}

export default function SectionHeader({ emoji }: SectionHeaderProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const lineVariants = {
    hidden: {
      scaleX: 0,
      opacity: 1,
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 1.8,
        ease: "easeOut",
      },
    },
  };

  const emojiVariants = {
    hidden: {
      scale: 1,
      rotate: 0,
    },
    visible: {
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 1.5,
        delay: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex items-center justify-center space-x-8">
        {/* Left line */}
        <motion.span
          initial="hidden"
          animate={controls}
          variants={lineVariants}
          className="flex-1 block h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-gray-400 shadow-sm origin-right"
          style={{ transformOrigin: "right" }}
        />

        {emoji && (
          <motion.div
            initial="hidden"
            animate={controls}
            variants={emojiVariants}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 shadow-lg border border-amber-200/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-100/20 to-transparent opacity-60" />
            <span className="text-3xl relative z-10">{emoji}</span>
          </motion.div>
        )}

        {/* Right line */}
        <motion.span
          initial="hidden"
          animate={controls}
          variants={lineVariants}
          className="flex-1 block h-[2px] bg-gradient-to-r from-gray-400 via-gray-300 to-transparent shadow-sm origin-left"
          style={{ transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
