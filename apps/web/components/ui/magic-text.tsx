"use client";

import * as React from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

export interface MagicTextProps {
  text: string;
  className?: string;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
}

/**
 * Renders one word with a scroll-driven opacity ramp.
 *
 * Deliberately carries NO font-family, font-size or font-weight utilities: every
 * typographic property is inherited from whatever parent wraps <MagicText />, so the
 * project's Noto Serif / Plus Jakarta scale stays authoritative. Only opacity is animated.
 */
const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative mr-[0.3em] inline-block [font:inherit]">
      <span className="absolute opacity-20 select-none [font:inherit]" aria-hidden="true">
        {children}
      </span>
      <motion.span className="[font:inherit]" style={{ opacity: opacity }}>
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ text, className = "" }) => {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={`flex flex-wrap leading-relaxed ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default MagicText;
