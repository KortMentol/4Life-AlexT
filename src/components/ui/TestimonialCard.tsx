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
      className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col items-center text-center border border-white/20 dark:border-gray-700/50 hover:border-white/40 dark:hover:border-gray-600/70 h-full"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "-50px 0px" }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <motion.img
        src={image}
        alt={name}
        loading="lazy"
        className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-primary/30 dark:ring-primary/50"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
        whileHover={{ scale: 1.05 }}
      />
      <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-4 leading-relaxed">"{quote}"</p>
      <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{name}</h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
    </motion.div>
  );
};

export default TestimonialCard;
