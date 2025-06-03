import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

const SectionHeading = ({ title, subtitle, description, centered = false, light = false, className = '' }: SectionHeadingProps) => {
  return (
    <motion.div
      className={`mb-12 ${centered ? "text-center" : ""} ${className} relative z-10`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      animate={{
        opacity: 1, 
        y: 0,
        height: 'auto',
        transition: { duration: 0.5 }
      }}
      variants={{
        hidden: { opacity: 0, y: 20, height: 0 },
        show: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.5 } }
      }}
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
