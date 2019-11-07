"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Circular buffer
 */
class CircularBuffer {
    /**
     * constructor of CircularBuffer
     * @param [length=50] Size of buffer
     * @param [allowOverFlow=true] allow to push when buffer is full, you will lose data
     */
    constructor(length = 50, allowOverFlow = true) {
        this.pointerWrite = 0;
        this.pointerRead = 0;
        this.count = 0;
        this.length = length;
        this.allowOverFlow = allowOverFlow;
        this.buffer = new Array(this.length);
    }
    /**
     * count of item in list
     * @returns {number} size of list
     */
    size() {
        return this.count;
    }
    /**
     * pop out from lista last
     * @returns {T} oldes item
     */
    pop() {
        if (this.count === 0) {
            throw "empty";
        }
        const i = this.pointerRead;
        this.pointerRead = (this.length + this.pointerRead + 1) % this.length;
        this.count--;
        const temp = this.buffer[i];
        if (temp === undefined) {
            throw "undefined";
        }
        this.buffer[i] = undefined;
        return temp;
    }
    /**
     * Push item in circular buffer
     * @param item {T} item
     */
    push(item) {
        if (!this.allowOverFlow && this.count === this.length) {
            throw "overflow";
        }
        this.buffer[this.pointerWrite] = item;
        this.pointerWrite = (this.length + this.pointerWrite + 1) % this.length;
        if (this.count === this.length) {
            this.pointerRead = this.pointerWrite;
        }
        else {
            this.count++;
        }
    }
    /**
     * Empty the circle buffer
     */
    clear() {
        this.pointerRead = 0;
        this.pointerWrite = 0;
        this.count = 0;
        this.buffer = new Array(this.length);
    }
    /**
     * pop all item
     * @returns {T[]} list
     */
    export() {
        let result = [];
        while (this.size() > 0) {
            result[result.length] = this.pop();
        }
        return result;
    }
}
exports.CircularBuffer = CircularBuffer;
