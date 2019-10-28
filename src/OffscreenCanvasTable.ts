import { OffscreenCanvasMesssage, OffscreenCanvasMesssageType } from "./OffscreenCanvasMessage";
import { TouchEventToCanvasTableTouchEvent } from "./CanvasTableTouchEvent";

export class OffscreenCanvasTable {
    private canvas: HTMLCanvasElement;
    private worker: Worker;
    readonly offscreenCanvasTableId: number;

    constructor(offscreenCanvasTableId:number, worker: Worker, htmlId: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(htmlId);
        const offscreen = this.canvas.transferControlToOffscreen();
        this.worker = worker;
        this.offscreenCanvasTableId = offscreenCanvasTableId;
        this.worker.postMessage(
            { 
                mthbCanvasTable: offscreenCanvasTableId, 
                type: OffscreenCanvasMesssageType.create, 
                offscreen: offscreen,
                width: this.canvas.clientWidth,
                height: this.canvas.clientHeight,
                r: window.devicePixelRatio
            }, 
            [ <any>offscreen ]);

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
        worker.addEventListener('message', this.workerMessage);
    }
    public expendedAll():void {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.expendedAll
        });
    }
    public collapseAll():void {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.collapseAll
        });

    }
    private resize() {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.resize, 
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight,
            r: window.devicePixelRatio
        });
    }

    private canvasWheel = (e: WheelEvent) => {
        e.preventDefault(); 
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.scroll, 
            deltaMode: e.deltaMode,
            deltaX: e.deltaX,
            deltaY: e.deltaY        
        });
    }
    private canvasMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.mouseDown, 
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop
        });
    }
    private canvasMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.mouseMove, 
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop
        });
    }
    private canvasMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.mouseUp, 
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop
        });
    }
    private canvasMouseLeave = () => {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.mouseLeave
        });
    }

    private canvasTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.TouchStart,
            event:TouchEventToCanvasTableTouchEvent(e),
            offsetTop: this.canvas.offsetTop,
            offsetLeft: this.canvas.offsetLeft
        });
    }
    private canvasTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.TouchMove,
            event:TouchEventToCanvasTableTouchEvent(e),
            offsetTop: this.canvas.offsetTop,
            offsetLeft: this.canvas.offsetLeft
        });
    }
    private canvasTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.TouchEnd,
            event:TouchEventToCanvasTableTouchEvent(e),
            offsetTop: this.canvas.offsetTop,
            offsetLeft: this.canvas.offsetLeft
        });
    }

    private canvasKeydown = (e: KeyboardEvent) => {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.keyDown,
            keycode: e.keyCode
        });
    }

    private canvasMouseUpExtended = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.mouseUpExtended, 
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop
        });

    }
    private canvasMouseMoveExtended = (e: MouseEvent) => {
        e.preventDefault();
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId, 
            type: OffscreenCanvasMesssageType.mouseMoveExtended, 
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop
        });
    }

    private workerMessage = (message:MessageEvent) => {
        if (message.data.mthbCanvasTable !== this.offscreenCanvasTableId) { return; }
        var data = <OffscreenCanvasMesssage>message.data;
        switch (data.type){
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
        }
    }

    private postMessage(data:OffscreenCanvasMesssage): void {
        this.worker.postMessage(data);    
    }
}
