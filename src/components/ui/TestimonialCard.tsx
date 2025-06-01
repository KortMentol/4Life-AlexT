import { motion } from "framer-motion";

interface TestimonialCardProps {
  id?: string;
  image: string;
  name: string;
  title: string;
  quote: string;
  delay?: number;
}

const TestimonialCard = ({ image, name, title, quote, delay = 0 }: TestimonialCardProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay }}
      whileHover={{ y: -5 }}
    >
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-primary-light dark:ring-primary-dark"
      />
      <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-4 leading-relaxed">
        "{quote}"
      </p>
      <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
        {name}
      </h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
    </motion.div>
  );
};

export default TestimonialCard;
