import { useIsMobile } from "@/hooks/useIsMobile";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";
import { useTransition } from "@/context";
import { siteConfig } from "@/site-config/site";
import { scrollToTop } from "@/utils/navigationUtils";
import DarkVeil from "@/components/effects/DarkVeil";
import { DynamicLogo } from "@/components/ui";

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();

  // <-- 1. Получаем доступ к transitionTo и текущему пути
  const { transitionTo } = useTransition();
  const location = useLocation();

  // <-- 2. Создаем умный обработчик клика
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
      transition: { duration: 0.5 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <footer className="pt-16 pb-8 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 w-full h-full z-1">
        <DarkVeil
          speed={0.8}
          hueShift={isMobile ? 340 : 360}
          noiseIntensity={0}
          scanlineFrequency={0}
          scanlineIntensity={0}
          warpAmount={5}
          resolutionScale={1}
          isMobile={isMobile}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 z-10"></div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* О компании */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants}>
              <a href="/" onClick={(e) => handleLinkClick(e, "/")} className="inline-block mb-6">
                <DynamicLogo alt="4Life Logo" className="" size="lg" themeOverride="dark" />
              </a>
              <p className="text-gray-300 mb-6 text-pretty">
                4Life Research – глобальная компания в области велнеса, специализирующаяся на научных разработках для
                поддержки иммунной системы.
              </p>
              <div className="flex space-x-4">
                <a
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href={siteConfig.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={siteConfig.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href={siteConfig.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
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
            <motion.h3 variants={itemVariants} className="text-lg font-bold mb-6 text-white">
              Быстрые ссылки
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-3">
              {/* <-- 3. Заменяем все Link на a с нашим обработчиком */}
              <li>
                <a
                  href="/products"
                  onClick={(e) => handleLinkClick(e, "/products")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Продукты
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, "/about")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  О компании
                </a>
              </li>
              <li>
                <a
                  href="/about-me"
                  onClick={(e) => handleLinkClick(e, "/about-me")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Обо мне
                </a>
              </li>
              <li>
                <a
                  href="/partnership"
                  onClick={(e) => handleLinkClick(e, "/partnership")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Партнерство
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, "/contact")}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
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
            <motion.h3 variants={itemVariants} className="text-lg font-bold mb-6 text-white">
              Контакты
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-white mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-300">{siteConfig.contact.address}</span>
              </li>
            </motion.ul>
          </motion.div>
        </div>

        {/* Нижняя часть футера */}
        <div className="pt-8 border-t border-gray-200/20 dark:border-gray-700/50">
          <div className="text-center">
            <p className="text-gray-300 text-sm">© {currentYear} Александр Тощев. Все права защищены.</p>

            <p className="text-xs text-gray-400 max-w-3xl mx-auto mt-6 leading-relaxed">
              Информация, представленная на этом вебсайте, относится исключительно к рынку Евразии.
            </p>
            <p className="text-xs text-gray-400 font-medium mt-2">
              БИОЛОГИЧЕСКИ АКТИВНАЯ ДОБАВКА. НЕ МОЖЕТ ЗАМЕНЯТЬ ЛЕКАРСТВА.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
