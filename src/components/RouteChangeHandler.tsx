// src/components/RouteChangeHandler.tsx

import { lenis } from "@/lib/lenis";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const STORAGE_KEY = "scroll_positions_v_final";

const RouteChangeHandler = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isFirstLoad = useRef(true);
  const previousPath = useRef(location.pathname + location.search + location.hash);

  // --- Управление хранилищем ---
  const saveScrollPosition = (path: string, position: number) => {
    try {
      const positions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      positions[path] = Math.round(position);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch (error) {
      console.warn("RouteChangeHandler: Failed to save position.", error);
    }
  };

  const getScrollPosition = (path: string): number | null => {
    try {
      const positions = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return positions[path] ?? null;
    } catch {
      return null;
    }
  };

  // --- Сохранение позиции при прокрутке (оптимизированное) ---
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        saveScrollPosition(location.pathname + location.search, window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, location.search]);

  // --- Основная логика управления скроллом ---
  useLayoutEffect(() => {
    const currentPath = location.pathname + location.search;

    // ШАГ 1: ВСЕГДА УБИВАЕМ ИНЕРЦИЮ LENIS ПРИ ЛЮБОЙ НАВИГАЦИИ
    lenis?.stop();

    // ШАГ 2: ОПРЕДЕЛЯЕМ СЦЕНАРИЙ НАВИГАЦИИ

    // СЦЕНАРИЙ A: ПЕРВАЯ ЗАГРУЗКА / ПЕРЕЗАГРУЗКА СТРАНИЦЫ
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      const savedY = getScrollPosition(currentPath);

      if (savedY !== null && savedY > 0) {
        // Используем "агрессивный" метод: отключаем браузерное восстановление
        history.scrollRestoration = "manual";
        const isMobile = window.innerWidth < 768;

        const restoreScroll = () => {
          if (isMobile) {
            // 🔥 МОБИЛЬНАЯ ОПТИМИЗИРОВАННАЯ ЛОГИКА (60 FPS)
            const forceScroll = () => {
              requestAnimationFrame(() => {
                window.scrollTo(0, savedY);
                lenis?.scrollTo(savedY, { immediate: true, force: true });
              });
            };
            
            // Оптимизированное принуждение через RAF
            let attempts = 0;
            const scheduleForceScroll = () => {
              if (attempts < 3) {
                forceScroll();
                attempts++;
                requestAnimationFrame(scheduleForceScroll);
              }
            };
            scheduleForceScroll();
            
            setTimeout(() => {
              lenis?.start();
              history.scrollRestoration = "auto";
              console.log(`🔥 Mobile reload scroll FORCED to ${savedY}px`);
            }, 200);
          } else {
            // ПК ЛОГИКА (С ПОПЫТКАМИ КАК РАНЬШЕ)
            let pcRestoreTimeout: NodeJS.Timeout | null = null;
            
            const attemptRestore = (attemptsLeft = 25, interval = 100) => {
              if (attemptsLeft <= 0) {
                console.warn(`RouteChangeHandler: Failed to restore scroll to ${savedY}px for ${currentPath}.`);
                if (pcRestoreTimeout) clearTimeout(pcRestoreTimeout);
                lenis?.start();
                history.scrollRestoration = "auto";
                return;
              }

              const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

              if (pageHeight >= savedY) {
                lenis?.scrollTo(savedY, { immediate: true, force: true });
                console.log(`✅ PC scroll restored for ${currentPath} to ${savedY}px`);
                if (pcRestoreTimeout) clearTimeout(pcRestoreTimeout);
                setTimeout(() => {
                  lenis?.start();
                  history.scrollRestoration = "auto";
                }, 250);
              } else {
                setTimeout(() => attemptRestore(attemptsLeft - 1, interval), interval);
              }
            };

            pcRestoreTimeout = setTimeout(() => {
              console.warn(`RouteChangeHandler: PC restore timeout after 3s.`);
              lenis?.start();
              history.scrollRestoration = "auto";
            }, 3000);

            if (document.readyState === "complete") {
              attemptRestore();
            } else {
              window.addEventListener("load", () => attemptRestore(), { once: true });
            }
          }
        };

        // Комбинированный подход: ResizeObserver + проверка после загрузки
        let observer: ResizeObserver | null = null;
        let restored = false;
        
        const cleanup = () => {
          if (restored) return;
          restored = true;
          observer?.disconnect();
          restoreScroll();
        };

        const restoreTimeout = setTimeout(() => {
          console.warn(`RouteChangeHandler: Restore timeout on reload.`);
          cleanup();
        }, 3000);

        // ResizeObserver для отслеживания роста страницы
        observer = new ResizeObserver((entries) => {
          const pageHeight = entries[0]?.contentRect?.height;
          if (typeof pageHeight === "number" && pageHeight >= savedY) {
            clearTimeout(restoreTimeout);
            cleanup();
          }
        });
        observer.observe(document.body);
        
        // 🔥 ОПТИМИЗИРОВАННАЯ ПРОВЕРКА ПОСЛЕ ЗАГРУЗКИ
        const checkAfterLoad = () => {
          if (restored) return;
          
          requestAnimationFrame(() => {
            const currentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            if (currentHeight >= savedY) {
              clearTimeout(restoreTimeout);
              cleanup();
            } else {
              // Оптимизированная повторная проверка
              requestAnimationFrame(() => setTimeout(checkAfterLoad, 100));
            }
          });
        };
        
        if (document.readyState === 'complete') {
          setTimeout(checkAfterLoad, 100);
        } else {
          window.addEventListener('load', () => setTimeout(checkAfterLoad, 100), { once: true });
        }
      } else {
        // Если скролла нет, просто запускаем все как обычно
        history.scrollRestoration = "auto";
        lenis?.start();
      }
      return;
    }

    // СЦЕНАРИЙ B: НАВИГАЦИЯ ВНУТРИ ПРИЛОЖЕНИЯ
    const previousPathWithoutHash = previousPath.current.split('#')[0];
    const hasOnlyHashChanged = previousPathWithoutHash === currentPath;

    if (hasOnlyHashChanged) {
      // Изменился только хеш (открытие/закрытие меню) -> НЕ скроллим!
      lenis?.start();
    } else if (navigationType === "POP") {
      // Переход "назад/вперед" -> доверяем браузеру
      lenis?.start();
    } else {
      // Реальный переход на другую страницу -> скроллим вверх
      lenis?.scrollTo(0, { immediate: true, force: true });
      lenis?.start();
    }

    // Обновляем предыдущий путь для следующего рендера
    previousPath.current = location.pathname + location.search + location.hash;
  }, [location.pathname, location.search, navigationType]);

  return null;
};

export default RouteChangeHandler;
