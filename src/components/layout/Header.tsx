import { lenis } from "@/lib/lenis";
import DynamicLogo from "@/shared/ui/DynamicLogo";
import HamburgerButton from "@/shared/ui/HamburgerButton";
import MobileMenu from "@/widgets/MobileMenu";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ProductListIcon from "../ui/ProductListIcon";
import TextShineEffect from "./TextShineEffect";

import { mainNav, siteConfig } from "../../config/site";
import { useTheme } from "../../context/useTheme";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [lastYPos, setLastYPos] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentYPos = window.scrollY;
      const isScrolledDown = currentYPos > lastYPos;

      if (currentYPos > 150 && isScrolledDown) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastYPos(currentYPos);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastYPos]);

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      lenis.stop();
      lenis.velocity = 0;
      navigate("/");
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        lenis.scrollTo(0, { immediate: true });
        setTimeout(() => lenis.start(), 50);
      });
    } else {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  const handleHamburgerClick = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <motion.header
        role="banner"
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed w-full z-40 top-0 py-3 md:py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
        style={{
          WebkitBackdropFilter: "blur(8px)",
          backdropFilter: "blur(8px)",
          top: "env(safe-area-inset-top)",
        }}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left Section: Hamburger on Mobile, Logo + Name on Desktop */}
            <div className="flex items-center">
              <div className="md:hidden relative z-[100] no-highlight">
                <HamburgerButton isOpen={mobileMenuOpen} toggle={handleHamburgerClick} />
              </div>
              <button
                onClick={handleLogoClick}
                className="hidden md:flex items-center space-x-4 group"
                aria-label="Главная страница"
              >
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                  <DynamicLogo alt="4Life Logo" size="md" />
                </div>
                <div>
                  <TextShineEffect
                    text={siteConfig.distributor.name}
                    className="font-bold text-base leading-tight text-gray-800 dark:text-gray-100"
                  />
                  <div className={`text-sm font-medium ${theme === "light" ? "text-amber-600" : "text-amber-300"}`}>
                    Builder Elite
                  </div>
                </div>
              </button>
            </div>

            {/* Center Section: Logo on Mobile, Nav on Desktop */}
            <div className="flex-1 flex justify-center items-center">
              {/* Name and Status for Mobile */}
              <div className="md:hidden">
                <button
                  onClick={handleLogoClick}
                  className="flex flex-col items-center group"
                  aria-label="Главная страница"
                >
                  <div className="text-center">
                    <TextShineEffect
                      text={siteConfig.distributor.name}
                      className="font-bold text-sm leading-tight text-gray-900 dark:text-white"
                    />
                    <div className={`text-xs font-medium ${theme === "light" ? "text-amber-600" : "text-amber-300"}`}>
                      Builder Elite
                    </div>
                  </div>
                </button>
              </div>

              {/* Navigation for Desktop */}
              <nav role="navigation" className="hidden md:flex items-center space-x-1 h-full">
                {mainNav.map((item) => (
                  <div key={item.href} className="relative flex items-center h-full">
                    <NavLink
                      to={item.href}
                      onClick={(e) => {
                        if (location.pathname === item.href) {
                          e.preventDefault();
                          lenis.scrollTo(0, {
                            duration: 1.2,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                          });
                        }
                      }}
                      className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative"
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            }
                          >
                            {item.title}
                          </span>
                          {isActive && (
                            <motion.span
                              className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                              layoutId="underline"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center justify-end">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/80 rounded-full p-1 transition-all duration-300 shadow-inner">
                <ProductListIcon />
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${theme === "light" ? "text-gray-600 hover:bg-gray-200" : "text-gray-400 hover:bg-gray-700"} transition-colors duration-300`}
                  aria-label="Переключить тему"
                >
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </div>
              <div className="md:hidden">
                <ProductListIcon />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default Header;
