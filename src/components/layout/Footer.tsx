import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig } from '../../config/site';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // Анимация для элементов
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Анимация для контейнера
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16 pb-8 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-400/5 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      
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
              <Link to="/" className="inline-block mb-6">
                <img 
                  src="/assets/images/brand/4life-logo.svg" 
                  alt="4Life Logo" 
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-pretty">
                4Life Research – глобальная компания в области велнеса, специализирующаяся на научных разработках для поддержки иммунной системы.
              </p>
              <div className="flex space-x-4">
                <a 
                  href={siteConfig.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href={siteConfig.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href={siteConfig.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-300 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href={siteConfig.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
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
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-bold mb-6 text-gray-900 dark:text-white"
            >
              Быстрые ссылки
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-3">
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Продукты
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  О компании
                </Link>
              </li>
              <li>
                <Link 
                  to="/about-me" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Обо мне
                </Link>
              </li>
              <li>
                <Link 
                  to="/partnership" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Партнерство
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Контакты
                </Link>
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
              className="text-lg font-bold mb-6 text-gray-900 dark:text-white"
            >
              Контакты
            </motion.h3>
            <motion.ul variants={itemVariants} className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <a 
                  href={`mailto:${siteConfig.contact.email}`} 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <a 
                  href={`tel:${siteConfig.contact.phone.replace(/\\s/g, '')}`} 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  {siteConfig.contact.address}
                </span>
              </li>
            </motion.ul>
          </motion.div>
          
          {/* Подписка */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h3 
              variants={itemVariants}
              className="text-lg font-bold mb-6 text-gray-900 dark:text-white"
            >
              Подписаться на новости
            </motion.h3>
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-400 mb-4"
            >
              Получайте последние новости и обновления о продуктах 4Life.
            </motion.p>
            <motion.form 
              variants={itemVariants}
              className="flex flex-col space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="input-modern w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-modern btn-primary-modern px-4 py-3 rounded-lg text-white font-medium transition-all duration-300"
              >
                Подписаться
              </button>
            </motion.form>
          </motion.div>
        </div>
        
        {/* Нижняя часть футера */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} {siteConfig.distributor.name}. Все права защищены.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/privacy-policy" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                Политика конфиденциальности
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;