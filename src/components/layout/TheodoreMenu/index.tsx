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

// === Константы таймингов анимации волн (секунды) ===
// Используются для метки "чёрного" кадра и синхронизации префетча.
const WAVE_OPEN_DOWN_1 = 0.8; // вниз до полуэкрана (открытие)
const WAVE_OPEN_DOWN_2 = 0.3; // вниз до полного чёрного (открытие)
const WAVE_OPEN_UP_1 = 0.3; // вверх до полуэкрана (открытие)
const WAVE_OPEN_UP_2 = 0.8; // вверх до исчезновения (открытие)

const NAVIGATION_EPS = 0.06; // небольшой буфер, чтобы навигация началась строго «на чёрном»

// Полное время анимации открытия меню (для старта префетча после завершения)
const OPEN_TOTAL =
  WAVE_OPEN_DOWN_1 + WAVE_OPEN_DOWN_2 + WAVE_OPEN_UP_1 + WAVE_OPEN_UP_2; // 2.2с

// Типизация глобального окна для флага перехода меню
declare global {
  interface Window {
    __menuTransitionInProgress?: boolean;
  }
}

// --- Утилиты префетча на уровне модуля (стабильные ссылки) ---
const routePrefetchers: Record<string, () => Promise<unknown>> = {
  "/": () => import("@/pages/HomePage"),
  "/products": () => import("@/pages/ProductsPage"),
  "/about": () => import("@/pages/AboutPage"),
  "/about-me": () => import("@/pages/AboutMePage"),
  "/contact": () => import("@/pages/ContactPage"),
  "/partnership": () => import("@/pages/PartnershipPage"),
  "/how-to-buy": () => import("@/pages/HowToBuyPage"),
};

function prefetchAllRoutesExcept(currentPath: string) {
  const entries = Object.entries(routePrefetchers).filter(
    ([path]) => path !== currentPath,
  );
  entries.forEach(([, loader]) => {
    loader().catch(() => {});
  });
}

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

const TheodoreMenu: React.FC<TheodoreMenuProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  const location = useLocation();
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const overlayPathRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  // Путь, на который пользователь кликнул. Если null — закрытие по стрелке.
  const pendingHrefRef = useRef<string | null>(null);

  const handleMobileLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    // Сохраняем целевой путь для координации закрытия и навигации на «чёрном» кадре
    pendingHrefRef.current = href;
    onClose(); // запустит закрытие меню (ниже перехватим в useEffect)
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
        // Сообщаем глобально, что переход завершён (включая случай закрытия по стрелке)
        window.dispatchEvent(new CustomEvent("menu-transition-complete"));
        window.__menuTransitionInProgress = false;
      },
    });

    const tl = timelineRef.current;

    tl.set(overlayPath, {
      attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" },
    });
    tl.to(
      overlayPath,
      {
        duration: 0.8,
        ease: "power4.in",
        attr: { d: "M 0 100 V 50 Q 50 0 100 50 V 100 z" },
      },
      0,
    );
    tl.to(overlayPath, {
      duration: 0.3,
      ease: "power2",
      attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
    });
    // Момент полного чёрного экрана
    tl.addLabel("fullBlack");
    tl.set(menuWrap, { autoAlpha: 1, pointerEvents: "auto" });
    tl.set(overlayPath, { attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" } })
      .to(overlayPath, {
        duration: 0.3,
        ease: "power2.in",
        attr: { d: "M 0 0 V 50 Q 50 0 100 50 V 0 z" },
      })
      .to(overlayPath, {
        duration: 0.8,
        ease: "power4",
        attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
      });
    tl.fromTo(
      menuItems,
      { y: 150, opacity: 0 },
      { duration: 1.1, ease: "power4", y: 0, opacity: 1, stagger: 0.05 },
      "-=1.1",
    );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (isOpen) {
      tl.play();
      return;
    }

    // Меню закрывается. Если пользователь кликнул пункт (есть pendingHref) —
    // идём в reverse() и ставим паузу ровно на 'fullBlack', где делаем навигацию.
    if (!pendingHrefRef.current) {
      tl.reverse();
      return;
    }

    // Безопасно остановим внешние твины и запустим обратное проигрывание
    gsap.killTweensOf(tl);
    const labelTime =
      tl.labels["fullBlack"] ?? WAVE_OPEN_DOWN_1 + WAVE_OPEN_DOWN_2; // запасной расчёт
    let lastTime = tl.time();
    const prevUpdate = tl.eventCallback("onUpdate") as gsap.Callback | null;
    const targetHref = pendingHrefRef.current;

    const atBlack = () => {
      // Пауза на чёрном кадре и навигация
      tl.pause(labelTime);
      const href = targetHref!;
      const isSame = location.pathname === href;
      window.__menuTransitionInProgress = true;
      window.dispatchEvent(new CustomEvent("menu-transition-start"));
      if (isSame) {
        scrollToTop({ immediate: false });
      } else {
        navigate(href);
      }

      // Небольшой буфер, чтобы чёрный кадр гарантированно попал на экран и DOM успел обновиться
      gsap.delayedCall(NAVIGATION_EPS, () => {
        // Снятие обработчика onUpdate, чтобы не триггериться снова
        tl.eventCallback("onUpdate", prevUpdate || null);
        // Продолжаем обратное проигрывание (2-я волна) после навигации
        tl.resume();
        pendingHrefRef.current = null;
      });
    };

    const onUpdate = () => {
      const t = tl.time();
      if (lastTime > labelTime && t <= labelTime) {
        atBlack();
      }
      lastTime = t;
    };
    tl.eventCallback("onUpdate", onUpdate);
    tl.reverse();

    return () => {
      // Очистка onUpdate, если эффект размонтируется или зависимость изменится
      if (tl.eventCallback("onUpdate") === onUpdate) {
        tl.eventCallback("onUpdate", prevUpdate || null);
      }
    };
  }, [isOpen, navigate, location.pathname]);

  // --- Префетч модулей страниц, когда меню полностью открылось ---
  // Стартуем после завершения анимации открытия, чтобы не мешать ей.
  useEffect(() => {
    if (!isOpen) return;
    const current = location.pathname;
    const tl = timelineRef.current;
    const delay = (tl?.totalDuration?.() ?? OPEN_TOTAL) + 0.15;
    const delayed = gsap.delayedCall(delay, () => {
      prefetchAllRoutesExcept(current);
    });
    return () => {
      delayed.kill();
    };
  }, [isOpen, location.pathname]);

  // --- Утилиты префетча перенесены на уровень модуля ---

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
            <div
              className="tiles__line-img tiles__line-img--large"
              style={{ backgroundImage: `url(${img4})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img5})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img6})` }}
            ></div>
            <div
              className="tiles__line-img tiles__line-img--large"
              style={{ backgroundImage: `url(${img4})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img5})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img6})` }}
            ></div>
          </div>
          <div className="tiles__line">
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img1})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img2})` }}
            ></div>
            <div
              className="tiles__line-img tiles__line-img--large"
              style={{ backgroundImage: `url(${img3})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img1})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img2})` }}
            ></div>
            <div
              className="tiles__line-img tiles__line-img--large"
              style={{ backgroundImage: `url(${img3})` }}
            ></div>
          </div>
          <div className="tiles__line">
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img7})` }}
            ></div>
            <div
              className="tiles__line-img tiles__line-img--large"
              style={{ backgroundImage: `url(${img8})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img9})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img7})` }}
            ></div>
            <div
              className="tiles__line-img tiles__line-img--large"
              style={{ backgroundImage: `url(${img8})` }}
            ></div>
            <div
              className="tiles__line-img"
              style={{ backgroundImage: `url(${img9})` }}
            ></div>
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
      <svg
        className="overlay"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
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
