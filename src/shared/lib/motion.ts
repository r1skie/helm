// Shared motion presets for consistent hover/tap/enter interactions.
export const tHover = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};
