import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Icons } from '../../utils/icons';
const { Shield, Menu, X } = Icons;
import { motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const headerClass = scrolled
    ? 'bg-white shadow-md'
    : 'bg-transparent';

  const navLinks = [
    { title: 'Главная', path: '/' },
    { title: 'Обо мне', path: '/about' },
    { title: 'Продукция 4Life', path: '/products' },
    { title: 'Как приобрести', path: '/purchase' },
    { title: 'Партнерство', path: '/partnership' },
    { title: 'Отзывы', path: '/testimonials' },
    { title: 'Контакты', path: '/contact' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${headerClass}`}>
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex flex-col items-start text-xl font-bold"
            onClick={closeMenu}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-blue-900">АЛЕКСАНДР ТОЩЕВ</span>
            </div>
            <span className="text-sm font-normal text-green-600 mt-0.5">Ваш Билдер Элит 4Life</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-sm font-medium hover:text-blue-600 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-700'
                      }`
                    }
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          className="lg:hidden bg-white shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col py-4 px-4">
            {navLinks.map((link) => (
              <li key={link.path} className="border-b border-gray-100 last:border-b-0">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `block py-3 text-base ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-700'
                    }`
                  }
                  onClick={closeMenu}
                >
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Header;