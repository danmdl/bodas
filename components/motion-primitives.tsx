"use client";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 }),
    springY = useSpring(y, { stiffness: 180, damping: 18 });
  return (
    <motion.div
      className={`magnetic ${className}`}
      ref={ref}
      style={reduced ? {} : { x: springX, y: springY }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const box = ref.current.getBoundingClientRect();
        x.set((e.clientX - box.left - box.width / 2) * 0.12);
        y.set((e.clientY - box.top - box.height / 2) * 0.12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? {} : { opacity: [0.65, 1], y: [22, 0] }}
      viewport={{ once: true, margin: "-55px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
