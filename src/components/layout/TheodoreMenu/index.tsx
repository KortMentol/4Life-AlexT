import { mainNav } from "@/site-config/site";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { Link, NavigateFunction, useLocation } from "react-router-dom";
import { lenis } from "../../../lib/lenis";
import { scrollToTop } from "../../../utils/navigationUtils";
import DynamicLogo from "../../ui/DynamicLogo";
import SciFiThemeToggle from "../../ui/SciFiThemeToggle";
import "./style.css";

import img1 from "../../../assets/images/MobileMenu/1.jpg";
import img2 from "../../../assets/images/MobileMenu/2.jpg";
import img3 from "../../../assets/images/MobileMenu/3.jpg";
import img4 from "../../../assets/images/MobileMenu/4.jpg";
import img5 from "../../../assets/images/MobileMenu/5.jpg";
import img6 from "../../../assets/images/MobileMenu/6.jpg";
import img7 from "../../../assets/images/MobileMenu/7.jpg";
import img8 from "../../../assets/images/MobileMenu/8.jpg";
import img9 from "../../../assets/images/MobileMenu/9.jpg";

interface TheodoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: NavigateFunction;
}

const NeonArrowButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="unbutton button-close">
    <svg width="60" height="60" viewBox="0 0 100 100">
      <defs>
        <filter id="neon-glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 20 70 L 50 40 L 80 70"
        stroke="#00f0ff"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="neon-arrow-path"
        filter="url(#neon-glow)"
      />
    </svg>
  </button>
);

const TheodoreMenu: React.FC<TheodoreMenuProps> = ({ isOpen, onClose, navigate }) => {
  const location = useLocation();
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const overlayPathRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleMobileLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const isCurrentPage = location.pathname === href;

    gsap.delayedCall(0.9, () => {
      if (isCurrentPage) {
        scrollToTop({ duration: 1.5, immediate: false });
      } else {
        navigate(href);
      }
    });

    onClose();
  };

  useEffect(() => {
    if (!menuWrapRef.current || !overlayPathRef.current) return;

    const menuWrap = menuWrapRef.current;
    const overlayPath = overlayPathRef.current;
    const menuItems = gsap.utils.toArray<HTMLElement>(".menu__item", menuWrap);

    gsap.set(menuWrap, { autoAlpha: 0, pointerEvents: "none" });

    timelineRef.current = gsap.timeline({
      paused: true,
      onStart: () => {
        lenis.stop();
      },
      onReverseComplete: () => {
        gsap.set(menuWrap, { autoAlpha: 0, pointerEvents: "none" });
        lenis.start();
      },
    });

    const tl = timelineRef.current;

    tl.set(overlayPath, { attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" } });
    tl.to(overlayPath, { duration: 0.8, ease: "power4.in", attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" } }, 0);
    tl.to(overlayPath, { duration: 0.3, ease: "power2", attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" } });
    tl.set(menuWrap, { autoAlpha: 1, pointerEvents: "auto" });
    tl.set(overlayPath, { attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" } })
      .to(overlayPath, { duration: 0.3, ease: "power2.in", attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" } })
      .to(overlayPath, { duration: 0.8, ease: "power4", attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" } });
    tl.fromTo(
      menuItems,
      { y: 150, opacity: 0 },
      { duration: 1.1, ease: "power4", y: 0, opacity: 1, stagger: 0.05 },
      "-=1.1"
    );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (timelineRef.current) {
      if (isOpen) {
        timelineRef.current.play();
      } else {
        timelineRef.current.reverse();
      }
    }
  }, [isOpen]);

  return (
    <div className="theodore-menu-container">
      <div ref={menuWrapRef} className="menu-wrap">
        <div className="menu-header">
          <NeonArrowButton onClick={onClose} />
        </div>
        <div className="menu-logo-container">
          <DynamicLogo />
        </div>
        <div className="tiles">
          <div className="tiles__line">
            <div className="tiles__line-img tiles__line-img--large" style={{ backgroundImage: `url(${img4})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img5})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img6})` }}></div>
            <div className="tiles__line-img tiles__line-img--large" style={{ backgroundImage: `url(${img4})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img5})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img6})` }}></div>
          </div>
          <div className="tiles__line">
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img1})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img2})` }}></div>
            <div className="tiles__line-img tiles__line-img--large" style={{ backgroundImage: `url(${img3})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img1})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img2})` }}></div>
            <div className="tiles__line-img tiles__line-img--large" style={{ backgroundImage: `url(${img3})` }}></div>
          </div>
          <div className="tiles__line">
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img7})` }}></div>
            <div className="tiles__line-img tiles__line-img--large" style={{ backgroundImage: `url(${img8})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img9})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img7})` }}></div>
            <div className="tiles__line-img tiles__line-img--large" style={{ backgroundImage: `url(${img8})` }}></div>
            <div className="tiles__line-img" style={{ backgroundImage: `url(${img9})` }}></div>
          </div>
        </div>
        <nav className="menu">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="menu__item"
              onClick={(e) => handleMobileLinkClick(e, item.href)}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="menu-footer">
          <SciFiThemeToggle />
        </div>
      </div>
      <svg className="overlay" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          ref={overlayPathRef}
          className="overlay__path"
          vectorEffect="non-scaling-stroke"
          d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
        />
      </svg>
    </div>
  );
};

export default TheodoreMenu;
