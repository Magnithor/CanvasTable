/**
 * Circular buffer
 */
export class CircularBuffer<T = any> {
  private pointerWrite = 0;
  private pointerRead = 0;
  private buffer: Array<T | undefined>;
  private length: number;
  private count = 0;
  private allowOverFlow: boolean;

  /**
   * constructor of CircularBuffer
   * @param [length=50] Size of buffer
   * @param [allowOverFlow=true] allow to push when buffer is full, you will lose data
   */
  public constructor(length: number = 50, allowOverFlow: boolean = true) {
    this.length = length;
    this.allowOverFlow = allowOverFlow;
    this.buffer = new Array(this.length);
  }
  /**
   * count of item in list
   * @returns {number} size of list
   */
  public size(): number {
    return this.count;
  }
  /**
   * pop out from lista last
   * @returns {T} oldes item
   */
  public pop(): T {
    if (this.count === 0) {
      throw new Error("empty");
    }
    const i = this.pointerRead;
    this.pointerRead = (this.length + this.pointerRead + 1) % this.length;
    this.count--;
    const temp = this.buffer[i];
    if (temp === undefined) {
      throw new Error("undefined");
    }
    this.buffer[i] = undefined;
    return temp;
  }

  /**
   * Push item in circular buffer
   * @param item {T} item
   */
  public push(item: T): void {
    if (!this.allowOverFlow && this.count === this.length) {
      throw new Error("overflow");
    }
    this.buffer[this.pointerWrite] = item;
    this.pointerWrite = (this.length + this.pointerWrite + 1) % this.length;
    if (this.count === this.length) {
      this.pointerRead = this.pointerWrite;
    } else {
      this.count++;
    }
  }
  /**
   * Empty the circle buffer
   */
  public clear(): void {
    this.pointerRead = 0;
    this.pointerWrite = 0;
    this.count = 0;
    this.buffer = new Array(this.length);
  }

  /**
   * pop all item
   * @returns {T[]} list
   */
  public export(): T[] {
    const result: T[] = [];
    while (this.size() > 0) {
      result[result.length] = this.pop();
    }

    return result;
  }
}
