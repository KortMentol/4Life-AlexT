// Файл: src/components/layout/Footer.tsx

import CssVeilBackground from "@/components/effects/CssVeilBackground";
import DarkVeil from "@/components/effects/DarkVeil";
import { DynamicLogo } from "@/components/ui";
import { useTransition } from "@/context";
import { useIsMobile, usePerformanceTier } from "@/hooks";
import { siteConfig } from "@/site-config/site";
import { scrollToTop } from "@/utils/navigationUtils";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  const tier = usePerformanceTier();
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();
  const { transitionTo } = useTransition();
  const location = useLocation();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    if (location.pathname === href) {
      scrollToTop({ immediate: false });
    } else {
      transitionTo(href);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobile ? 0.3 : 0.5 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        delayChildren: isMobile ? 0.1 : 0.2,
      },
    },
  };

  return (
    <footer className="pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0">
        {tier === "high" && !isMobile ? (
          <DarkVeil
            speed={0.8}
            hueShift={360}
            noiseIntensity={0}
            scanlineFrequency={0}
            scanlineIntensity={0}
            warpAmount={5}
            resolutionScale={1}
            isMobile={isMobile}
          />
        ) : (
          <CssVeilBackground />
        )}
      </div>

      {/* Весь контент ниже имеет z-10 и будет НАД фоном */}
      <div className="footer-top-line absolute top-0 left-0 w-full h-px bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 z-10"></div>

      <div
        className={`container footer-container ${tier !== "high" ? "css-veil-active" : ""} max-w-7xl mx-auto px-6 relative z-10`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* О компании */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants}>
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, "/")}
                className="inline-block mb-6"
              >
                <DynamicLogo
                  alt="4Life Logo"
                  className=""
                  size="lg"
                />
              </a>
              <p className="footer-description text-gray-300 mb-6 text-pretty">
                4Life Research – глобальная компания в области велнеса,
                специализирующаяся на научных разработках для поддержки иммунной
                системы.
              </p>
              <div className="flex space-x-3">
                {/* Telegram */}
                <a
                  href={siteConfig.links.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer-social-icon text-white/80 transition-colors duration-200 ${
                    isMobile ? "active:text-white" : "hover:text-white"
                  }`}
                  aria-label="Telegram"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.67l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.958.889z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`footer-social-icon text-white/80 transition-colors duration-200 ${
                    isMobile ? "active:text-white" : "hover:text-white"
                  }`}
                  aria-label="WhatsApp"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                {/* Phone */}
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className={`footer-social-icon text-white/80 transition-colors duration-200 ${
                    isMobile ? "active:text-white" : "hover:text-white"
                  }`}
                  aria-label="Позвонить"
                >
                  <Phone size={20} />
                </a>
                {/* Email */}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className={`footer-social-icon text-white/80 transition-colors duration-200 ${
                    isMobile ? "active:text-white" : "hover:text-white"
                  }`}
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Быстрые ссылки */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h3
              variants={itemVariants}
              className="footer-heading text-lg font-bold mb-6 text-white"
            >
              Быстрые ссылки
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-3">
              <li>
                <a
                  href="/products"
                  onClick={(e) => handleLinkClick(e, "/products")}
                  className={`footer-link text-gray-300 transition-colors duration-200 ${
                    isMobile ? "active:text-blue-400" : "hover:text-blue-400"
                  }`}
                >
                  Продукты
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, "/about")}
                  className={`footer-link text-gray-300 transition-colors duration-200 ${
                    isMobile ? "active:text-blue-400" : "hover:text-blue-400"
                  }`}
                >
                  О компании
                </a>
              </li>
              <li>
                <a
                  href="/about-me"
                  onClick={(e) => handleLinkClick(e, "/about-me")}
                  className={`footer-link text-gray-300 transition-colors duration-200 ${
                    isMobile ? "active:text-blue-400" : "hover:text-blue-400"
                  }`}
                >
                  Обо мне
                </a>
              </li>
              <li>
                <a
                  href="/partnership"
                  onClick={(e) => handleLinkClick(e, "/partnership")}
                  className={`footer-link text-gray-300 transition-colors duration-200 ${
                    isMobile ? "active:text-blue-400" : "hover:text-blue-400"
                  }`}
                >
                  Партнерство
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, "/contact")}
                  className={`footer-link text-gray-300 transition-colors duration-200 ${
                    isMobile ? "active:text-blue-400" : "hover:text-blue-400"
                  }`}
                >
                  Контакты
                </a>
              </li>
            </motion.ul>
          </motion.div>

          {/* Контакты */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h3
              variants={itemVariants}
              className="footer-heading text-lg font-bold mb-6 text-white"
            >
              Контакты
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-4">
              <li className="flex items-start">
                <Mail className="footer-icon w-5 h-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className={`footer-link text-gray-300 transition-colors duration-200 ${
                    isMobile ? "active:text-blue-400" : "hover:text-blue-400"
                  }`}
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="footer-icon w-5 h-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className={`footer-link text-gray-300 transition-colors duration-200 ${
                    isMobile ? "active:text-blue-400" : "hover:text-blue-400"
                  }`}
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="footer-icon w-5 h-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                <span className="footer-description text-gray-300">
                  {siteConfig.contact.address}
                </span>
              </li>
            </motion.ul>
          </motion.div>
        </div>

        {/* Нижняя часть футера */}
        <div className="pt-8 border-t footer-divider border-gray-200/20 dark:border-gray-700/50">
          <div className="text-center">
            <p className="footer-description text-gray-300 text-sm">
              © {currentYear} Александр Тощев. Все права защищены.
            </p>

            <p className="footer-small-text text-xs max-w-3xl mx-auto mt-6 leading-relaxed">
              Информация, представленная на этом вебсайте, относится
              исключительно к рынку Евразии.
            </p>
            <p className="footer-small-text text-xs font-medium mt-2">
              БИОЛОГИЧЕСКИ АКТИВНАЯ ДОБАВКА. НЕ МОЖЕТ ЗАМЕНЯТЬ ЛЕКАРСТВА.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
