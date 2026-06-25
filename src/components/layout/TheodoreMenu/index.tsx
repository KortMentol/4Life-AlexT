import DynamicLogo from "@/components/ui/DynamicLogo";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { mainNav } from "@/site-config/site";
import { scrollToTop } from "@/utils/navigationUtils";
import { gsap } from "gsap";
import React, {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

import img1 from "@/assets/images/MobileMenu/1.jpg";
import img2 from "@/assets/images/MobileMenu/2.jpg";
import img3 from "@/assets/images/MobileMenu/3.jpg";
import img4 from "@/assets/images/MobileMenu/4.jpg";
import img5 from "@/assets/images/MobileMenu/5.jpg";
import img6 from "@/assets/images/MobileMenu/6.jpg";
import img7 from "@/assets/images/MobileMenu/7.jpg";
import img8 from "@/assets/images/MobileMenu/8.jpg";
import img9 from "@/assets/images/MobileMenu/9.jpg";

const WAVE_OPEN_DOWN_1 = 0.8;
const WAVE_OPEN_DOWN_2 = 0.3;
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

declare global {
  interface Window {
    __menuTransitionInProgress?: boolean;
  }
}

interface TheodoreMenuProps {
  isOpen: boolean;
  onClose: (isNavigatingAway?: boolean) => void;
}

// ─── Scramble hook ────────────────────────────────────────────────────────────
function useScramble(text: string) {
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    let frame = 0;
    const totalFrames = text.length * 3;

    timerRef.current = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * text.length);
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealed) return text[i];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join(""),
      );
      if (frame >= totalFrames) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setDisplay(text);
      }
    }, 30);
  }, [text]);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  return { display, scramble };
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────
const MenuItem: React.FC<{
  title: string;
  href: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent, href: string) => void;
}> = ({ title, href, isActive, onClick }) => {
  const { display, scramble } = useScramble(title);

  return (
    <Link
      to={href}
      className={`menu__item${isActive ? " menu__item--active" : ""}`}
      onClick={(e) => {
        scramble();
        onClick(e, href);
      }}
    >
      <span className="menu__item-text">{display}</span>
      <span className="menu__item-line" aria-hidden="true" />
    </Link>
  );
};

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

// ─── TheodoreMenu ─────────────────────────────────────────────────────────────
const TheodoreMenu: React.FC<TheodoreMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const tier = usePerformanceTier();
  const menuWrapRef = useRef<HTMLDivElement>(null);
  const overlayPathRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingHrefRef = useRef<string | null>(null);

  const [activeHref, setActiveHref] = useState(location.pathname);

  useEffect(() => {
    if (isOpen) setActiveHref(location.pathname);
  }, [isOpen, location.pathname]);

  const handleMobileLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const isSame = location.pathname === href;

    if (isSame) {
      // Закрываем меню обычным способом
      onClose();
      // Запускаем скролл с задержкой в 1000мс.
      // Это время позволяет анимации закрытия меню почти завершиться
      // перед началом плавного скролла вверх
      setTimeout(() => {
        scrollToTop({ duration: 1.2 });
      }, 1000);
    } else {
      // Если переходим на другую страницу, запоминаем куда идти
      setActiveHref(href);
      pendingHrefRef.current = href;
      // Закрываем с флагом перехода
      onClose(true);
    }
  };

  // ─── GSAP Timeline (инициализация) ─────────────────────────────────────────
  useEffect(() => {
    if (!menuWrapRef.current || !overlayPathRef.current) return;

    const menuWrap = menuWrapRef.current;
    const overlayPath = overlayPathRef.current;
    const menuItems = gsap.utils.toArray<HTMLElement>(".menu__item", menuWrap);

    if (tier === "low") menuWrap.classList.add("low-performance");

    gsap.set(menuWrap, { autoAlpha: 0, pointerEvents: "none" });

    timelineRef.current = gsap.timeline({
      paused: true,
      onStart: () => {
        document.body.classList.add("menu-open");
        document.documentElement.classList.add("menu-open");
        window.dispatchEvent(
          new CustomEvent("custom-scrollbar-update", {
            detail: { action: "hide" },
          }),
        );
      },
      onReverseComplete: () => {
        gsap.set(menuWrap, { autoAlpha: 0, pointerEvents: "none" });
        document.body.classList.remove("menu-open");
        document.documentElement.classList.remove("menu-open");
        window.__menuTransitionInProgress = false;
        window.dispatchEvent(new CustomEvent("menu-transition-complete"));
        window.dispatchEvent(
          new CustomEvent("custom-scrollbar-update", {
            detail: { action: "show" },
          }),
        );
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
      if (tier === "low" && menuWrap)
        menuWrap.classList.remove("low-performance");
    };
  }, [tier]);

  // ─── Управление анимацией по isOpen ────────────────────────────────────────
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;

    if (isOpen) {
      pendingHrefRef.current = null;
      tl.play();
      return;
    }

    // Простое закрытие (стрелка, кнопка назад) — без навигации
    if (!pendingHrefRef.current) {
      tl.reverse();
      return;
    }

    // Закрытие с переходом на другую страницу — пауза на fullBlack, navigate
    gsap.killTweensOf(tl);
    const labelTime =
      tl.labels["fullBlack"] ?? WAVE_OPEN_DOWN_1 + WAVE_OPEN_DOWN_2;
    let lastTime = tl.time();
    const prevUpdate = tl.eventCallback("onUpdate") as gsap.Callback | null;
    const targetHref = pendingHrefRef.current;

    const atBlack = () => {
      tl.pause(labelTime);
      window.__menuTransitionInProgress = true;
      window.dispatchEvent(new CustomEvent("menu-transition-start"));

      // Оборачиваем навигацию в startTransition, чтобы снизить приоритет рендера
      // и не блокировать анимации. Используем replace: true, чтобы затереть
      // фантомную запись с открытым меню
      startTransition(() => {
        navigate(targetHref!, { replace: true });
      });

      // Даем слабому железу время на сборку мусора и рендер тяжелой страницы
      // Для мобилок (ширина < 768) даем 400мс, для ПК оставляем 150мс
      const delay = window.innerWidth < 768 ? 400 : 150;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            tl.eventCallback("onUpdate", prevUpdate || null);
            tl.resume();
            pendingHrefRef.current = null;
          }, delay);
        });
      });
    };

    const onUpdate = () => {
      const t = tl.time();
      if (lastTime > labelTime && t <= labelTime) atBlack();
      lastTime = t;
    };

    tl.eventCallback("onUpdate", onUpdate);
    tl.reverse();

    return () => {
      if (tl.eventCallback("onUpdate") === onUpdate) {
        tl.eventCallback("onUpdate", prevUpdate || null);
      }
    };
  }, [isOpen, navigate, location.pathname]);

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
            <MenuItem
              key={item.href}
              title={item.title}
              href={item.href}
              isActive={activeHref === item.href}
              onClick={handleMobileLinkClick}
            />
          ))}
        </nav>
        <div className="menu-footer">
          {/* Футер очищен от переключателя тем, разметка сбалансирована */}
          <div className="h-8" />
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

export default React.memo(TheodoreMenu);
