import { TouchEventToCanvasTableTouchEvent } from "../../share/CanvasTableTouchEvent";
import { OffscreenCanvasMesssage, OffscreenCanvasMesssageType } from "../../share/OffscreenCanvasTableMessage";

export class OffscreenCanvasTable {
    public readonly offscreenCanvasTableId: number;
    private canvas: HTMLCanvasElement;
    private worker: Worker;

    constructor(offscreenCanvasTableId: number, worker: Worker, canvas: HTMLCanvasElement|string) {
        if (typeof canvas === "string") {
            this.canvas = (document.getElementById(canvas) as HTMLCanvasElement);
        } else {
            this.canvas = canvas;
        }

        const offscreen = this.canvas.transferControlToOffscreen();
        this.worker = worker;
        this.offscreenCanvasTableId = offscreenCanvasTableId;
        this.worker.postMessage(
            {
                height: this.canvas.clientHeight,
                mthbCanvasTable: offscreenCanvasTableId,
                offscreen,
                r: window.devicePixelRatio,
                type: OffscreenCanvasMesssageType.create,
                width: this.canvas.clientWidth,
            },
            [  offscreen as any ]);

        this.canvas.addEventListener("wheel", this.canvasWheel);
        this.canvas.addEventListener("mousedown", this.canvasMouseDown);
        this.canvas.addEventListener("mousemove", this.canvasMouseMove);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp);
        this.canvas.addEventListener("mouseleave", this.canvasMouseLeave);
        this.canvas.addEventListener("touchstart", this.canvasTouchStart);
        this.canvas.addEventListener("touchmove", this.canvasTouchMove);
        this.canvas.addEventListener("touchend", this.canvasTouchEnd);
        this.canvas.addEventListener("keydown", this.canvasKeydown);
        window.addEventListener("resize", () => {
            this.resize();
        });
        worker.addEventListener("message", this.workerMessage);
    }
    public expendAll(): void {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.expendAll,
        });
    }
    public collapseAll(): void {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.collapseAll,
        });
    }
    public setGroupBy(col?: string[]) {
        this.postMessage({
            groupBy: col,
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.setGroupBy,
        });
    }

    private resize() {
        this.postMessage({
            height: this.canvas.clientHeight,
            mthbCanvasTable: this.offscreenCanvasTableId,
            r: window.devicePixelRatio,
            type: OffscreenCanvasMesssageType.resize,
            width: this.canvas.clientWidth,
        });
    }

    private canvasWheel = (e: WheelEvent) => {
        e.preventDefault();
        this.postMessage({
            deltaMode: e.deltaMode,
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.scroll,
        });
    }
    private canvasMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.mouseDown,
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        });
    }
    private canvasMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.mouseMove,
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        });
    }
    private canvasMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.mouseUp,
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        });
    }
    private canvasMouseLeave = () => {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.mouseLeave,
        });
    }

    private canvasTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            event: TouchEventToCanvasTableTouchEvent(e),
            mthbCanvasTable: this.offscreenCanvasTableId,
            offsetLeft: this.canvas.offsetLeft,
            offsetTop: this.canvas.offsetTop,
            type: OffscreenCanvasMesssageType.TouchStart,
        });
    }
    private canvasTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            event: TouchEventToCanvasTableTouchEvent(e),
            mthbCanvasTable: this.offscreenCanvasTableId,
            offsetLeft: this.canvas.offsetLeft,
            offsetTop: this.canvas.offsetTop,
            type: OffscreenCanvasMesssageType.TouchMove,
        });
    }
    private canvasTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            event: TouchEventToCanvasTableTouchEvent(e),
            mthbCanvasTable: this.offscreenCanvasTableId,
            offsetLeft: this.canvas.offsetLeft,
            offsetTop: this.canvas.offsetTop,
            type: OffscreenCanvasMesssageType.TouchEnd,
        });
    }

    private canvasKeydown = (e: KeyboardEvent) => {
        this.postMessage({
            keycode: e.keyCode,
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.keyDown,
        });
    }

    private canvasMouseUpExtended = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.mouseUpExtended,
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        });

    }
    private canvasMouseMoveExtended = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.mouseMoveExtended,
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        });
    }

    private workerMessage = (message: MessageEvent) => {
        if (message.data.mthbCanvasTable !== this.offscreenCanvasTableId) { return; }
        const data =  message.data as OffscreenCanvasMesssage;
        switch (data.type) {
            case OffscreenCanvasMesssageType.askForExtentedMouseMoveAndMaouseUp:
                this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
                this.canvas.removeEventListener("mouseup", this.canvasMouseUp);
                window.addEventListener("mousemove", this.canvasMouseMoveExtended);
                window.addEventListener("mouseup", this.canvasMouseUpExtended);
                break;
            case OffscreenCanvasMesssageType.askForNormalMouseMoveAndMaouseUp:
                window.removeEventListener("mousemove", this.canvasMouseMoveExtended);
                window.removeEventListener("mouseup", this.canvasMouseUpExtended);
                this.canvas.addEventListener("mousemove", this.canvasMouseMove);
                this.canvas.addEventListener("mouseup", this.canvasMouseUp);
                break;
            case OffscreenCanvasMesssageType.setCursor:
                this.canvas.style.cursor = data.cursor;
                break;
        }
    }

    private postMessage(data: OffscreenCanvasMesssage): void {
        this.worker.postMessage(data);
    }
}
