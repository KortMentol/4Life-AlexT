import { motion } from "framer-motion";

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}

const FeatureItem = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureItemProps) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay }}
    >
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default FeatureItem;
