import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { siteConfig, mainNav } from '../../config/site';

const Header = () => {
  const [scrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/ea/4Life_Research_logo.svg"
              alt="4Life Logo"
              className="h-8"
            />
            <span className="font-bold text-xl text-primary">
              {siteConfig.distributor.name}
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center space-x-8">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <Menu size={20} />
              <span>Купить</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <X size={20} />
              <span>Партнерство</span>
            </motion.button>
          </div>

          <button
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, height: isMobileMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <nav className="px-4 py-4">
            {mainNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `block py-2 px-3 text-gray-700 hover:text-primary ${
                    isActive ? 'text-primary font-medium' : ''
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Header;
