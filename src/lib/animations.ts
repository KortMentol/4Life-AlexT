import { Variants } from "framer-motion";

export const fadeInFromTop: Variants = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const fadeInFromBottom: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export const fadeInFromRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

export const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export const rotateY: Variants = {
  initial: { rotateY: 0 },
  hover: { rotateY: 5, transition: { duration: 0.3 } },
};
