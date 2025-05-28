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
        <a href={primaryButtonLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          {primaryButtonText}
        </a>
      );
    }

    return (
      <Link to={primaryButtonLink} className="btn btn-primary">
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
        >
          {secondaryButtonText}
        </a>
      );
    }

    return (
      <Link to={secondaryButtonLink} className="btn btn-outline mt-4 sm:mt-0 sm:ml-4">
        {secondaryButtonText}
      </Link>
    );
  };

  return (
    <motion.div
      className="bg-gray-50 border-t border-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-custom py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 mb-8">{description}</p>
          <div className="flex flex-col sm:flex-row justify-center">
            {renderPrimaryButton()}
            {renderSecondaryButton()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CallToAction;
