"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
};

export function Reveal({
  delay = 0,
  duration = 0.7,
  children,
  className,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration, ease: [0.2, 0.8, 0.2, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
