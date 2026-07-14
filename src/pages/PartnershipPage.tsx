/**
 * @module src/pages/PartnershipPage.tsx
 * @description Страница "Партнерство" в стиле Clinical Obsidian.
 * Тонкая обертка над полноценным секционным компонентом.
 * @author Kort & AI
 * @version 2.1.0
 */

import PartnershipSection from "@/components/sections/PartnershipSection";
import { SEO } from "@/seo/SEO";
import { motion } from "framer-motion";
import React from "react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

const PartnershipPage: React.FC = () => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
    <SEO
      title="Партнерство 4Life — Александр Тощев"
      description="Узнайте о возможностях партнерства с 4Life. Стабильный доход, прозрачная модель и поддержка опытного лидера."
      path="/partnership"
      type="website"
    />
    <PartnershipSection />
  </motion.div>
);

export default React.memo(PartnershipPage);
