import React, { useEffect, useMemo, useRef } from "react";

interface Grid3DProps {
  type: 1 | 2 | 3;
  triggerRef: React.RefObject<HTMLElement>;
  filterBlur?: boolean;
}

export const Grid3D: React.FC<Grid3DProps> = ({ type, triggerRef, filterBlur = true }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supports3D = () => {
      const el = document.createElement("div");
      el.style.transform = "translate3d(0,0,0)";
      return el.style.transform !== "";
    };

    if (!window.gsap || !window.ScrollTrigger || window.innerWidth < 1024 || !supports3D()) return;

    const grid = gridRef.current;
    if (!grid) return;

    const gridWrap = grid.querySelector(".grid-wrap");
    const gridItems = grid.querySelectorAll(".grid__item");
    if (!gridWrap || !gridItems.length) return;

    let timeline: any;

    const initGSAP = () => {
      const scrollTriggerConfig = {
        trigger: triggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        ease: "none",
        invalidateOnRefresh: true,
      };

      switch (type) {
        case 1:
          grid.style.setProperty("--perspective", "1000px");
          grid.style.setProperty("--grid-inner-scale", "0.5");
          timeline = window.gsap
            .timeline({ scrollTrigger: scrollTriggerConfig })
            .set(gridWrap, { rotationY: 25, force3D: true })
            .set(gridItems, { z: () => window.gsap.utils.random(-1600, 200), force3D: true })
            .fromTo(
              gridItems,
              { xPercent: () => window.gsap.utils.random(-1000, -500) },
              { xPercent: () => window.gsap.utils.random(500, 1000), ease: "none" },
            );
          break;
        case 2:
          grid.style.setProperty("--grid-width", "160%");
          grid.style.setProperty("--perspective", "2000px");
          grid.style.setProperty("--grid-inner-scale", "0.5");
          grid.style.setProperty("--grid-item-ratio", "0.8");
          grid.style.setProperty("--grid-columns", "6");
          grid.style.setProperty("--grid-gap", "14vw");

          timeline = window.gsap
            .timeline({ defaults: { ease: "none" }, scrollTrigger: scrollTriggerConfig })
            .set(gridWrap, { rotationX: 20, force3D: true })
            .set(gridItems, { z: () => window.gsap.utils.random(-3000, -1000), opacity: 0.3, force3D: true })
            .fromTo(
              gridItems,
              { yPercent: () => window.gsap.utils.random(100, 1000), rotationY: -45, opacity: 0.3 },
              { ease: "power2", yPercent: () => window.gsap.utils.random(-1000, -100), rotationY: 45, opacity: 0.7 },
              0,
            )
            .fromTo(gridWrap, { rotationZ: -5 }, { rotationX: -20, rotationZ: 10, scale: 1.2 }, 0);
          break;
        case 3:
          grid.style.setProperty("--grid-width", "105%");
          grid.style.setProperty("--grid-columns", "8");
          grid.style.setProperty("--perspective", "1500px");
          grid.style.setProperty("--grid-inner-scale", "0.5");
          timeline = window.gsap
            .timeline({ scrollTrigger: scrollTriggerConfig })
            .set(gridItems, {
              transformOrigin: "50% 0%",
              z: () => window.gsap.utils.random(-5000, -2000),
              rotationX: () => window.gsap.utils.random(-65, -25),
              opacity: 0,
              force3D: true,
            })
            .to(gridItems, {
              xPercent: () => window.gsap.utils.random(-150, 150),
              yPercent: () => window.gsap.utils.random(-300, 300),
              rotationX: 0,
              opacity: 0.8,
              ease: "none",
            })
            .to(gridWrap, { z: 6500, ease: "none" }, 0);
          break;
      }
    };

    if (window.__menuTransitionInProgress) {
      const onComplete = () => {
        initGSAP();
        window.removeEventListener("menu-transition-complete", onComplete);
      };
      window.addEventListener("menu-transition-complete", onComplete);
    } else {
      initGSAP();
    }

    return () => {
      if (timeline) timeline.kill();
    };
  }, [type, triggerRef]);

  const imageCount = useMemo(() => (window.innerWidth >= 1024 ? 20 : 8), []);
  const images = useMemo(
    () => Array.from({ length: imageCount }, (_, i) => `/images/backgrounds/HomePage/img/${(i % 20) + 1}.jpg`),
    [imageCount],
  );

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 z-10 hidden lg:block"
      style={{ perspective: "var(--perspective)" }}
      data-filter={String(filterBlur)}
    >
      <div className="grid-wrap grid h-full w-full p-8" style={{ transformStyle: "preserve-3d" }}>
        {images.map((src, i) => (
          <div key={i} className="grid__item aspect-[1.5] overflow-hidden rounded-xl">
            <div
              className="h-full w-full bg-cover bg-center rounded-xl"
              style={{ backgroundImage: `url(${src})`, imageRendering: "auto" } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
