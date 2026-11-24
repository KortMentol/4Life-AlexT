type Subscriber = (scrollY: number) => void;

class RAFLoop {
  private subscribers = new Set<Subscriber>();
  private rafId = 0;
  private running = false;

  private tick = () => {
    if (this.subscribers.size === 0) {
      this.running = false;
      return;
    }
    this.rafId = requestAnimationFrame(this.tick);
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
