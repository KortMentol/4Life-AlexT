import { lenis } from "@/lib/lenis";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Info, Phone, ShoppingBag, ShoppingCart, User, Users, X } from "lucide-react";
import React, { useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { isMobileDevice } from "../../utils/deviceUtils";
import { lockScroll } from "../../utils/domUtils";
import { scrollToTop } from "../../utils/navigationUtils";
import DynamicLogo from "../ui/DynamicLogo";
import SciFiThemeToggle from "../ui/SciFiThemeToggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { title: "Главная", href: "/", icon: <Home size={20} /> },
  { title: "Продукты", href: "/products", icon: <ShoppingBag size={20} /> },
  { title: "Как приобрести?", href: "/how-to-buy", icon: <ShoppingCart size={20} /> },
  { title: "О 4Life", href: "/about", icon: <Info size={20} /> },
  { title: "Обо Мне", href: "/about-me", icon: <User size={20} /> },
  { title: "Партнерство", href: "/partnership", icon: <Users size={20} /> },
  { title: "Контакты", href: "/contact", icon: <Phone size={20} /> },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingRoute, setPendingRoute] = React.useState<string | null>(null);
  const [locked, setLocked] = React.useState(false);
  const unlockScrollRef = useRef<(() => void) | null>(null);
  
  // Pure CSS Transform System - No Conflicts
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [canInteract, setCanInteract] = React.useState(false);
  
  // Advanced touch state with physics
  const touchState = useRef({
    startX: 0,
    currentX: 0,
    lastX: 0,
    velocity: 0,
    lastTime: 0,
    isActive: false,
    velocityHistory: [] as { v: number; t: number }[],
    momentum: 0
  });

  // Animation frame for smooth updates
  const animationFrame = useRef<number | null>(null);
  const isAnimating = useRef(false);

  React.useEffect(() => {
    if (!isOpen && pendingRoute) {
      navigate(pendingRoute);
      setPendingRoute(null);
      setLocked(false);
    }
  }, [isOpen, pendingRoute, navigate]);

  useEffect(() => {
    if (isOpen) {
      lenis.stop();
      unlockScrollRef.current = lockScroll();
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      setIsClosing(false);
      setIsDragging(false);
      touchState.current.isActive = false;
      
      // Reset animation state
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      isAnimating.current = false;
      
      // Smooth opening animation
      if (menuRef.current && overlayRef.current) {
        const premiumEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Start from closed position
        menuRef.current.style.transform = 'translate3d(-100%, 0, 0)';
        overlayRef.current.style.opacity = '0';
        
        requestAnimationFrame(() => {
          if (menuRef.current && overlayRef.current) {
            menuRef.current.style.transition = `transform 0.6s ${premiumEasing}`;
            overlayRef.current.style.transition = `opacity 0.6s ${premiumEasing}`;
            
            menuRef.current.style.transform = 'translate3d(0, 0, 0)';
            overlayRef.current.style.opacity = '1';
          }
        });
      }
      
      // Enable interaction after smooth opening
      setTimeout(() => setCanInteract(true), 400);
      
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.style.visibility = 'hidden';
    } else {
      setCanInteract(false);
      setIsDragging(false);
      touchState.current.isActive = false;
      
      // Cleanup animations
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      isAnimating.current = false;
      
      lenis.start();
      if (unlockScrollRef.current) {
        unlockScrollRef.current();
        unlockScrollRef.current = null;
      }
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      
      const canvas = document.querySelector('canvas');
      if (canvas) {
        setTimeout(() => canvas.style.visibility = 'visible', 600);
      }
    }
    
    return () => {
      // Cleanup on unmount
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      lenis.start();
      if (unlockScrollRef.current) {
        unlockScrollRef.current();
        unlockScrollRef.current = null;
      }
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.style.visibility = 'visible';
    };
  }, [isOpen]);

  const handleLinkClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (locked || isClosing) return;
    
    if (location.pathname === href) {
      setIsClosing(true);
      onClose();
      setTimeout(() => scrollToTop({ immediate: isMobileDevice() }), 10);
    } else {
      setLocked(true);
      setPendingRoute(href);
      setIsClosing(true);
      onClose();
    }
  }, [locked, isClosing, location.pathname, onClose]);

  // Smooth transform with easing
  const updateTransform = useCallback((x: number, immediate = false) => {
    if (!menuRef.current || !overlayRef.current) return;
    
    const clampedX = Math.min(0, Math.max(-window.innerWidth, x));
    const progress = Math.abs(clampedX) / window.innerWidth;
    const opacity = Math.max(0, 1 - progress * 1.2);
    
    if (immediate) {
      menuRef.current.style.transform = `translate3d(${clampedX}px, 0, 0)`;
      overlayRef.current.style.opacity = opacity.toString();
    } else {
      requestAnimationFrame(() => {
        if (menuRef.current && overlayRef.current) {
          menuRef.current.style.transform = `translate3d(${clampedX}px, 0, 0)`;
          overlayRef.current.style.opacity = opacity.toString();
        }
      });
    }
  }, []);

  // Ultra-smooth close with advanced easing
  const closeMenu = useCallback(() => {
    if (isClosing || !menuRef.current) return;
    
    setIsClosing(true);
    setCanInteract(false);
    
    // Cancel any ongoing animation
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      isAnimating.current = false;
    }
    
    // Premium easing curve for awwwards feel
    const premiumEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    if (menuRef.current) {
      menuRef.current.style.transition = `transform 0.6s ${premiumEasing}`;
      menuRef.current.style.transform = 'translate3d(-100%, 0, 0)';
    }
    
    if (overlayRef.current) {
      overlayRef.current.style.transition = `opacity 0.6s ${premiumEasing}`;
      overlayRef.current.style.opacity = '0';
    }
    
    setTimeout(() => {
      onClose();
    }, 600);
  }, [isClosing, onClose]);

  // Advanced momentum animation
  const animateWithMomentum = useCallback((startX: number, targetX: number) => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    const startTime = performance.now();
    const distance = targetX - startX;
    const duration = Math.min(800, Math.max(300, Math.abs(distance) * 2));
    
    // Custom easing for natural feel
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Blend easing functions for ultra-smooth feel
      const easedProgress = progress < 0.5 
        ? easeOutQuart(progress * 2) * 0.5
        : 0.5 + easeOutExpo((progress - 0.5) * 2) * 0.5;
      
      const currentX = startX + distance * easedProgress;
      updateTransform(currentX, true);
      
      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        isAnimating.current = false;
        if (targetX <= -window.innerWidth * 0.7) {
          closeMenu();
        }
      }
    };
    
    animationFrame.current = requestAnimationFrame(animate);
  }, [updateTransform, closeMenu]);

  // Calculate smart velocity with history
  const calculateVelocity = useCallback((currentX: number, currentTime: number) => {
    const history = touchState.current.velocityHistory;
    const deltaTime = currentTime - touchState.current.lastTime;
    const deltaX = currentX - touchState.current.lastX;
    
    if (deltaTime > 0) {
      const currentVelocity = deltaX / deltaTime;
      history.push({ v: currentVelocity, t: currentTime });
      
      // Keep only recent history (last 100ms)
      const cutoff = currentTime - 100;
      touchState.current.velocityHistory = history.filter(h => h.t > cutoff);
      
      // Calculate weighted average velocity
      if (history.length > 0) {
        const totalWeight = history.reduce((sum, h) => sum + (h.t - cutoff), 0);
        const weightedVelocity = history.reduce((sum, h) => {
          const weight = (h.t - cutoff) / totalWeight;
          return sum + h.v * weight;
        }, 0);
        
        touchState.current.velocity = weightedVelocity;
      }
    }
    
    touchState.current.lastX = currentX;
    touchState.current.lastTime = currentTime;
  }, []);

  // Advanced touch start with momentum preparation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!canInteract || isClosing || !e.touches[0]) return;
    
    e.preventDefault();
    
    // Cancel any ongoing animations
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      isAnimating.current = false;
    }
    
    const touch = e.touches[0];
    const now = performance.now();
    
    touchState.current = {
      startX: touch.clientX,
      currentX: touch.clientX,
      lastX: touch.clientX,
      velocity: 0,
      lastTime: now,
      isActive: true,
      velocityHistory: [],
      momentum: 0
    };
    
    setIsDragging(true);
    
    // Remove transitions for immediate response
    if (menuRef.current) {
      menuRef.current.style.transition = 'none';
      menuRef.current.style.willChange = 'transform';
    }
    if (overlayRef.current) {
      overlayRef.current.style.transition = 'none';
      overlayRef.current.style.willChange = 'opacity';
    }
  }, [canInteract, isClosing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !touchState.current.isActive || !e.touches[0]) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const now = performance.now();
    const deltaX = touch.clientX - touchState.current.startX;
    
    // Enhanced resistance for natural feel
    let x = Math.min(0, deltaX);
    
    // Add subtle resistance when dragging beyond natural range
    if (x < -window.innerWidth * 0.8) {
      const excess = Math.abs(x) - window.innerWidth * 0.8;
      const resistance = Math.pow(excess / (window.innerWidth * 0.2), 0.7);
      x = -(window.innerWidth * 0.8 + excess * (1 - resistance * 0.8));
    }
    
    // Calculate advanced velocity with history
    calculateVelocity(touch.clientX, now);
    touchState.current.currentX = touch.clientX;
    
    updateTransform(x, true);
  }, [isDragging, updateTransform, calculateVelocity]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || !touchState.current.isActive) return;
    
    setIsDragging(false);
    touchState.current.isActive = false;
    
    const deltaX = touchState.current.currentX - touchState.current.startX;
    const velocity = touchState.current.velocity;
    const currentX = Math.min(0, deltaX);
    
    // Advanced decision logic with momentum
    const distanceThreshold = window.innerWidth * 0.3;
    const velocityThreshold = -0.3; // More sensitive
    const momentumFactor = Math.abs(velocity) * 200; // Convert to pixels
    
    // Smart close detection
    const shouldClose = 
      deltaX < -distanceThreshold || // Distance threshold
      (velocity < velocityThreshold && deltaX < -50) || // Fast swipe
      (deltaX < -100 && velocity < -0.1); // Medium swipe with some velocity
    
    // Clean up will-change
    if (menuRef.current) menuRef.current.style.willChange = 'auto';
    if (overlayRef.current) overlayRef.current.style.willChange = 'auto';
    
    if (shouldClose) {
      // Animate to close with momentum
      const targetX = -window.innerWidth - momentumFactor;
      animateWithMomentum(currentX, targetX);
    } else {
      // Smooth return with momentum consideration
      const returnEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      const returnDuration = Math.min(600, Math.max(300, Math.abs(currentX) * 1.5));
      
      if (menuRef.current) {
        menuRef.current.style.transition = `transform ${returnDuration}ms ${returnEasing}`;
        menuRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (overlayRef.current) {
        overlayRef.current.style.transition = `opacity ${returnDuration}ms ${returnEasing}`;
        overlayRef.current.style.opacity = '1';
      }
    }
  }, [isDragging, closeMenu, animateWithMomentum]);

  const handleCloseClick = useCallback(() => {
    if (isClosing) return;
    closeMenu();
  }, [isClosing, closeMenu]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/40 to-black/60"
            style={{ 
              backdropFilter: 'blur(8px)',
              opacity: 1
            }}
            onClick={handleCloseClick}
          />

          {/* Menu */}
          <div
            ref={menuRef}
            className="absolute top-0 left-0 w-full h-full flex flex-col"
            style={{
              transform: 'translate3d(0, 0, 0)',
              touchAction: 'pan-x',
              background: isDark 
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
              boxShadow: isDark
                ? '0 0 50px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(148, 163, 184, 0.1)'
                : '0 0 50px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(148, 163, 184, 0.2)',
              borderRight: isDark 
                ? '1px solid rgba(6, 182, 212, 0.3)' 
                : '1px solid rgba(59, 130, 246, 0.2)'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <motion.div
              className="flex items-center p-6 border-b"
              style={{
                borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                background: isDark
                  ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)'
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <button
                onClick={handleCloseClick}
                disabled={isClosing}
                className={`p-2 rounded-full transition-all duration-200 mr-4 ${
                  isDark 
                    ? 'bg-slate-800/50 text-cyan-400 hover:bg-slate-700/50 hover:text-cyan-300' 
                    : 'bg-blue-50/50 text-blue-600 hover:bg-blue-100/50 hover:text-blue-700'
                } ${isClosing ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  boxShadow: isDark 
                    ? '0 0 20px rgba(6, 182, 212, 0.2)' 
                    : '0 0 20px rgba(59, 130, 246, 0.2)'
                }}
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 flex justify-center items-center">
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <DynamicLogo alt="4Life Logo" size="lg" />
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.03, duration: 0.3 }}
                  >
                    <NavLink to={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                      {({ isActive }) => (
                        <div
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                            isActive
                              ? (isDark 
                                  ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 shadow-lg shadow-cyan-500/20" 
                                  : "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-700 shadow-lg shadow-blue-500/20")
                              : (isDark 
                                  ? "text-slate-300 hover:bg-slate-800/30 hover:text-cyan-400" 
                                  : "text-gray-700 hover:bg-blue-50/30 hover:text-blue-600")
                          } ${locked || isClosing ? 'pointer-events-none opacity-50' : ''}`}
                          style={{
                            border: isActive 
                              ? (isDark ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)')
                              : '1px solid transparent'
                          }}
                        >
                          <span className={isActive ? (isDark ? "text-cyan-400" : "text-blue-600") : (isDark ? "text-slate-400" : "text-gray-500")}>
                            {link.icon}
                          </span>
                          <span className="font-medium">{link.title}</span>
                        </div>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div 
              className="p-6 border-t"
              style={{
                borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                background: isDark
                  ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <div className="flex justify-center">
                <SciFiThemeToggle />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;