import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonIcon?: LucideIcon;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  secondaryButtonIcon?: LucideIcon;
  isExternal?: boolean;
  className?: string;
  buttonText?: string;
  buttonLink?: string;
}

const CallToAction = ({
  title = "",
  description = "",
  primaryButtonText,
  primaryButtonLink,
  primaryButtonIcon,
  secondaryButtonText,
  secondaryButtonLink,
  secondaryButtonIcon,
  isExternal = false,
  className = "",
  buttonText,
  buttonLink,
}: CallToActionProps) => {
  // Backward compatibility
  const displayButtonText = primaryButtonText || buttonText || "";
  const displayButtonLink = primaryButtonLink || buttonLink || "";

  const renderPrimaryButton = () => {
    if (!displayButtonText || !displayButtonLink) return null;

    const PrimaryIcon = primaryButtonIcon;

    if (isExternal) {
      return (
        <motion.a
          href={displayButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={`Перейти к ${displayButtonText}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {displayButtonText}
          {PrimaryIcon && <PrimaryIcon className="w-5 h-5" />}
        </motion.a>
      );
    }

    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to={displayButtonLink}
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={displayButtonText}
        >
          {displayButtonText}
          {PrimaryIcon && <PrimaryIcon className="w-5 h-5" />}
        </Link>
      </motion.div>
    );
  };

  const renderSecondaryButton = () => {
    if (!secondaryButtonText || !secondaryButtonLink) return null;

    const SecondaryIcon = secondaryButtonIcon;

    if (isExternal) {
      return (
        <motion.a
          href={secondaryButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={secondaryButtonText}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {secondaryButtonText}
          {SecondaryIcon && <SecondaryIcon className="w-5 h-5" />}
        </motion.a>
      );
    }

    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to={secondaryButtonLink}
          className="inline-block px-8 py-3 text-lg font-medium text-center text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
          aria-label={secondaryButtonText}
        >
          {secondaryButtonText}
          {SecondaryIcon && <SecondaryIcon className="w-5 h-5" />}
        </Link>
      </motion.div>
    );
  };

  return (
    <section
      className={`py-16 md:py-24 bg-gradient-to-r from-blue-600/0 to-indigo-700/0 text-white ${className}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          {description && (
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {renderPrimaryButton()}
            {renderSecondaryButton()}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
