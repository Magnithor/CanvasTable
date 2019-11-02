/**
 * Circular buffer
 */
export declare class CircularBuffer<T = any> {
    private pointerWrite;
    private pointerRead;
    private buffer;
    private length;
    private count;
    private allowOverFlow;
    /**
     * constructor of CircularBuffer
     * @param [length=50] Size of buffer
     * @param [allowOverFlow=true] allow to push when buffer is full, you will lose data
     */
    constructor(length?: number, allowOverFlow?: boolean);
    /**
     * count of item in list
     * @returns {number} size of list
     */
    size(): number;
    /**
     * pop out from lista last
     * @returns {T} oldes item
     */
    pop(): T;
    /**
     * Push item in circular buffer
     * @param item {T} item
     */
    push(item: T): void;
    /**
     * Empty the circle buffer
     */
    clear(): void;
    /**
     * pop all item
     * @returns {T[]} list
     */
    export(): T[];
}
