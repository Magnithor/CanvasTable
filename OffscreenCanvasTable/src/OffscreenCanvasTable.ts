import { ICanvasTableColumn, IUpdateRect } from "../../share/CanvasTableColum";
import { CanvasTableEdit } from "../../share/CanvasTableEdit";
import { CanvasTableEditAction } from "../../share/CanvasTableEditAction";
import { TouchEventToCanvasTableTouchEvent } from "../../share/CanvasTableTouchEvent";
import { OffscreenCanvasMesssageFromWorker, OffscreenCanvasMesssageToWorker, OffscreenCanvasMesssageType } from "../../share/OffscreenCanvasTableMessage";

export class OffscreenCanvasTable <T = any> {
    public readonly offscreenCanvasTableId: number;
    private canvas: HTMLCanvasElement;
    private worker: Worker;
    private canvasTableEdit?: CanvasTableEdit;

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

        this.canvas.addEventListener("blur", this.canvasBlur);
        this.canvas.addEventListener("focus", this.canvasFocus);
        this.canvas.addEventListener("wheel", this.canvasWheel);
        this.canvas.addEventListener("dblclick", this.canvasDblClick);
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

    private canvasFocus = (ev: FocusEvent) => {
        this.postMessage({
            focus: true,
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.focus,
        });
    }

    private canvasBlur = (ev: FocusEvent) => {
        this.postMessage({
            focus: false,
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.focus,
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
    private canvasDblClick = (e: MouseEvent) => {
        e.preventDefault();
        //  this.dblClick(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasMesssageType.mouseDblClick,
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        });
    }
    private canvasMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this.canvas.focus();
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
            type: OffscreenCanvasMesssageType.touchStart,
        });
    }
    private canvasTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            event: TouchEventToCanvasTableTouchEvent(e),
            mthbCanvasTable: this.offscreenCanvasTableId,
            offsetLeft: this.canvas.offsetLeft,
            offsetTop: this.canvas.offsetTop,
            type: OffscreenCanvasMesssageType.touchMove,
        });
    }
    private canvasTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        this.postMessage({
            event: TouchEventToCanvasTableTouchEvent(e),
            mthbCanvasTable: this.offscreenCanvasTableId,
            offsetLeft: this.canvas.offsetLeft,
            offsetTop: this.canvas.offsetTop,
            type: OffscreenCanvasMesssageType.touchEnd,
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
        const data =  message.data as OffscreenCanvasMesssageFromWorker;
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
            case OffscreenCanvasMesssageType.updateForEdit:
                if (this.canvasTableEdit) {
                    this.canvasTableEdit.doRemove(true, undefined);
                }

                this.canvasTableEdit = new CanvasTableEdit(data.col, data.row, data.value,
                    data.cellHeight, this.onEditRemove);
                this.updateEditLocation(data.rect);
                break;
            case OffscreenCanvasMesssageType.locationForEdit:
                this.updateEditLocation(data.rect);
                break;
        }
    }

    private onEditRemove = (cancel: boolean, newData: string, action: CanvasTableEditAction | undefined) => {
        let row: number | undefined;
        let col: ICanvasTableColumn<T> | undefined;
        if (this.canvasTableEdit !== undefined) {
            col = this.canvasTableEdit.getColumn();
            row = this.canvasTableEdit.getRow();
        }
        this.canvasTableEdit = undefined;
        this.postMessage({
            action,
            cancel,
            col,
            mthbCanvasTable: this.offscreenCanvasTableId,
            newData,
            row,
            type: OffscreenCanvasMesssageType.onEditRemoveUpdateForEdit,
        });
    }
    private updateEditLocation(rect: IUpdateRect) {
        if (!this.canvasTableEdit) {
            return;
        }

        const top = this.canvas.offsetTop + rect.y;
        const left = this.canvas.offsetLeft + rect.x;

        this.canvasTableEdit.updateEditLocation(
            top, left, rect.width, rect.cellHeight,
            rect.clipTop, rect.clipRight, rect.clipBottom, rect.clipLeft);
    }

    private postMessage(data: OffscreenCanvasMesssageToWorker): void {
        this.worker.postMessage(data);
    }
}
