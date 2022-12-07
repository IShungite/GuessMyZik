/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-underscore-dangle */
export default class Timer {
  private _duration: number;

  private _onTimerEnd: () => void;

  private _onTimerUpdate: (timerRemaining: number) => void;

  private _timer?: NodeJS.Timer;

  private _counter: number = 0;

  constructor({ duration, onTimerEnd, onTimerUpdate }:
    { duration: number, onTimerEnd: () => void, onTimerUpdate: (timerRemaining: number) => void }) {
    this._duration = duration;
    this._onTimerEnd = onTimerEnd;
    this._onTimerUpdate = onTimerUpdate;
  }

  public get duration(): number {
    return this._duration;
  }

  public get timeRemaining(): number {
    return this._duration - this._counter;
  }

  public get timeElapsed(): number {
    return Math.min(this._counter, this._duration);
  }

  public start(): void {
    this._onTimerUpdate(this.timeRemaining);

    this._timer = setInterval(() => {
      this._counter += 0.010;

      const counterParsed = parseFloat(this._counter.toFixed(3));

      if (counterParsed % 1 === 0) {
        this._onTimerUpdate(this._duration - counterParsed);
      }

      if (this._counter >= this._duration) {
        this.stop();
        this._onTimerEnd();
      }
    }, 10);
  }

  public stop(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
      this._counter = 0;
    }
  }
}
