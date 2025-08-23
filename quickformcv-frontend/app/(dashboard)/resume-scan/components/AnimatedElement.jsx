"use client";

import { motion } from "framer-motion";

export const AnimatedElement = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) => {
  const yPosition = direction === "up" ? 20 : direction === "down" ? -10 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yPosition }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
