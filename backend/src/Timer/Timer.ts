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

  public start(): void {
    this._onTimerUpdate(this._duration - this._counter);

    this._timer = setInterval(() => {
      this._counter += 1;

      this._onTimerUpdate(this._duration - this._counter);

      if (this._duration <= 0) {
        this._onTimerEnd();
      }
    }, 1000);
  }

  public stop(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
      this._counter = 0;
    }
  }
}
