import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
}

const TestimonialCard = ({ name, location, text }: TestimonialCardProps) => {
  return (
    <motion.div 
      className="card p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Quote className="h-8 w-8 text-blue-500 mb-4" />
      <p className="text-gray-600 mb-6 italic">&quot;{text}&quot;</p>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;