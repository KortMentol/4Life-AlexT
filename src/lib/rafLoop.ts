/**
 * Глобальный RAF синглтон.
 * Вместо N отдельных requestAnimationFrame — один loop на всё приложение.
 * Каждый подписчик получает текущий scrollY и вызывается раз в кадр.
 *
 * Использование:
 *   const unsub = rafLoop.subscribe((scrollY) => { ... });
 *   // при размонтировании:
 *   unsub();
 */

type Subscriber = (scrollY: number) => void;

class RAFLoop {
  private subscribers = new Set<Subscriber>();
  private rafId = 0;
  private running = false;

  private tick = () => {
    this.rafId = requestAnimationFrame(this.tick);
    if (this.subscribers.size === 0) return;
    const scrollY = window.scrollY;
    this.subscribers.forEach((fn) => fn(scrollY));
  };

  subscribe(fn: Subscriber): () => void {
    this.subscribers.add(fn);
    if (!this.running) {
      this.running = true;
      this.rafId = requestAnimationFrame(this.tick);
    }
    return () => {
      this.subscribers.delete(fn);
      if (this.subscribers.size === 0) {
        cancelAnimationFrame(this.rafId);
        this.running = false;
      }
    };
  }
}

export const rafLoop = new RAFLoop();
