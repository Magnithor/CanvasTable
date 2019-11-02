export declare class OffscreenCanvasTable {
    private canvas;
    private worker;
    readonly offscreenCanvasTableId: number;
    constructor(offscreenCanvasTableId: number, worker: Worker, htmlId: string);
    expendedAll(): void;
    collapseAll(): void;
    private resize;
    private canvasWheel;
    private canvasMouseDown;
    private canvasMouseMove;
    private canvasMouseUp;
    private canvasMouseLeave;
    private canvasTouchStart;
    private canvasTouchMove;
    private canvasTouchEnd;
    private canvasKeydown;
    private canvasMouseUpExtended;
    private canvasMouseMoveExtended;
    private workerMessage;
    private postMessage;
}
