import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, description, centered = false, light = false }: SectionHeadingProps) => {
  return (
    <motion.div
      className={`mb-12 ${centered ? "text-center" : ""}`}
      initial={{ opacity: 0, y: 20, height: 0 }}
      whileInView={{ opacity: 1, y: 0, height: 'auto' }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={`mb-4 ${light ? "text-white" : "text-gray-900"}`}>{title}</h2>
      {subtitle && (
        <p className={`text-lg font-semibold ${light ? "text-blue-300" : "text-blue-600"} mb-2`}>{subtitle}</p>
      )}
      {description && <p className={`text-lg ${light ? "text-gray-200" : "text-gray-600"} mt-2`}>{description}</p>}
      <div className={`h-1 w-20 mt-4 ${centered ? "mx-auto" : ""} ${light ? "bg-blue-400" : "bg-blue-600"}`} />
    </motion.div>
  );
};

export default SectionHeading;
