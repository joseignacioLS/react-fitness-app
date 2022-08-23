class Timer {
  constructor(time) {
    this.time = time * 1000;
    this.current = 0;
    this.running = false;
    this.interval = null;
  }

  run(endF, tickF) {
    if (this.running) return;
    this.running = true;
    this.interval = setInterval(() => {
      this.current += 100;
      tickF(this.current / this.time * 100)
      if (this.current >= this.time) {
        this.running = false;
        clearInterval(this.interval);
        this.interval = null;
        endF()
      }
    }, 100);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.interval);
    this.interval = null;
  }

  reset() {
    this.current = 0;
    this.running = false;
    clearInterval(this.interval)
    this.interval = null;

  }
}

export default Timer;
