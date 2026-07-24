/**
 * A `setTimeout` that can be paused and resumed.
 *
 * Pausing banks the time that has already elapsed, so resuming fires the
 * callback after the *remaining* time rather than restarting the full delay.
 *
 * Used for the toast auto-dismiss countdown, which pauses while the cursor is
 * over the toast.
 */
export class PausableTimeout {
  private readonly _callback: () => void;

  /** Time left on the countdown, updated each time it's paused. */
  private _remainingMs: number;

  private _timerId: ReturnType<typeof setTimeout> | null = null;

  /** When the currently-running countdown was (re)started. */
  private _startedAt = 0;

  private _isPaused = false;

  /** Set once the callback has fired (or the countdown was cancelled). */
  private _isDone = false;

  constructor(callback: () => void, delayMs: number) {
    this._callback = callback;
    this._remainingMs = delayMs;
  }

  /** Whether the countdown is currently paused. */
  public get isPaused(): boolean {
    return this._isPaused;
  }

  /** Start the countdown for whatever time is left on it. */
  public start(): void {
    if (this._isDone) {
      return;
    }

    this.clear();
    this._isPaused = false;
    this._startedAt = Date.now();
    this._timerId = setTimeout(() => {
      this._timerId = null;
      this._isDone = true;
      this._callback();
    }, this._remainingMs);
  }

  /** Pause the countdown, banking the time that has already elapsed. */
  public pause(): void {
    if (this._isDone || this._isPaused || this._timerId === null) {
      return;
    }

    this._remainingMs = Math.max(0, this._remainingMs - (Date.now() - this._startedAt));
    this._isPaused = true;
    this.clear();
  }

  /** Resume a paused countdown from where it left off. */
  public resume(): void {
    if (this._isDone || !this._isPaused) {
      return;
    }

    this.start();
  }

  /** Cancel the countdown for good; it can't be started again. */
  public cancel(): void {
    this._isPaused = false;
    this._isDone = true;
    this.clear();
  }

  private clear(): void {
    if (this._timerId !== null) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
  }
}
