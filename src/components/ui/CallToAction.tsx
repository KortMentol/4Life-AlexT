import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CallToActionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  isExternal?: boolean;
}

const CallToAction = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  isExternal = false,
}: CallToActionProps) => {
  const renderPrimaryButton = () => {
    if (isExternal) {
      return (
        <a
          href={primaryButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          aria-label={`Перейти к ${primaryButtonText}`}
        >
          {primaryButtonText}
        </a>
      );
    }

    return (
      <Link to={primaryButtonLink} className="btn btn-primary" aria-label={`Перейти к ${primaryButtonText}`}>
        {primaryButtonText}
      </Link>
    );
  };

  const renderSecondaryButton = () => {
    if (!secondaryButtonText || !secondaryButtonLink) return null;

    if (isExternal) {
      return (
        <a
          href={secondaryButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline mt-4 sm:mt-0 sm:ml-4"
          aria-label={`Перейти к ${secondaryButtonText}`}
        >
          {secondaryButtonText}
        </a>
      );
    }

    return (
      <Link
        to={secondaryButtonLink}
        className="btn btn-outline mt-4 sm:mt-0 sm:ml-4"
        aria-label={`Перейти к ${secondaryButtonText}`}
      >
        {secondaryButtonText}
      </Link>
    );
  };

  return (
    <motion.div
      role="region"
      aria-label="Призыв к действию"
      className="relative py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px 0px", amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } }
      }}
    >
      <div className="absolute inset-0 bg-[url('https://i.ibb.co/0jX7M3Y/pattern.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-black/10"></div>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h3 
            id="cta-title" 
            className="text-2xl md:text-4xl font-bold text-white mb-6 relative z-10"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
            }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto relative z-10" 
            aria-describedby="cta-title"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
            }}
          >
            {description}
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, staggerChildren: 0.1 } }
            }}
          >
            {renderPrimaryButton()}
            {renderSecondaryButton()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CallToAction;
