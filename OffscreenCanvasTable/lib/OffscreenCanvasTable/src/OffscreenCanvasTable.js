"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OffscreenCanvasTableMessage_1 = require("../../share/OffscreenCanvasTableMessage");
const CanvasTableTouchEvent_1 = require("../../share/CanvasTableTouchEvent");
class OffscreenCanvasTable {
    constructor(offscreenCanvasTableId, worker, htmlId) {
        this.canvasWheel = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.scroll,
                deltaMode: e.deltaMode,
                deltaX: e.deltaX,
                deltaY: e.deltaY
            });
        };
        this.canvasMouseDown = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseDown,
                x: e.clientX - this.canvas.offsetLeft,
                y: e.clientY - this.canvas.offsetTop
            });
        };
        this.canvasMouseMove = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseMove,
                x: e.clientX - this.canvas.offsetLeft,
                y: e.clientY - this.canvas.offsetTop
            });
        };
        this.canvasMouseUp = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseUp,
                x: e.clientX - this.canvas.offsetLeft,
                y: e.clientY - this.canvas.offsetTop
            });
        };
        this.canvasMouseLeave = () => {
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseLeave
            });
        };
        this.canvasTouchStart = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.TouchStart,
                event: CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e),
                offsetTop: this.canvas.offsetTop,
                offsetLeft: this.canvas.offsetLeft
            });
        };
        this.canvasTouchMove = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.TouchMove,
                event: CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e),
                offsetTop: this.canvas.offsetTop,
                offsetLeft: this.canvas.offsetLeft
            });
        };
        this.canvasTouchEnd = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.TouchEnd,
                event: CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e),
                offsetTop: this.canvas.offsetTop,
                offsetLeft: this.canvas.offsetLeft
            });
        };
        this.canvasKeydown = (e) => {
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.keyDown,
                keycode: e.keyCode
            });
        };
        this.canvasMouseUpExtended = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseUpExtended,
                x: e.clientX - this.canvas.offsetLeft,
                y: e.clientY - this.canvas.offsetTop
            });
        };
        this.canvasMouseMoveExtended = (e) => {
            e.preventDefault();
            this.postMessage({
                mthbCanvasTable: this.offscreenCanvasTableId,
                type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseMoveExtended,
                x: e.clientX - this.canvas.offsetLeft,
                y: e.clientY - this.canvas.offsetTop
            });
        };
        this.workerMessage = (message) => {
            if (message.data.mthbCanvasTable !== this.offscreenCanvasTableId) {
                return;
            }
            var data = message.data;
            switch (data.type) {
                case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.askForExtentedMouseMoveAndMaouseUp:
                    this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
                    this.canvas.removeEventListener("mouseup", this.canvasMouseUp);
                    window.addEventListener("mousemove", this.canvasMouseMoveExtended);
                    window.addEventListener("mouseup", this.canvasMouseUpExtended);
                    break;
                case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.askForNormalMouseMoveAndMaouseUp:
                    window.removeEventListener("mousemove", this.canvasMouseMoveExtended);
                    window.removeEventListener("mouseup", this.canvasMouseUpExtended);
                    this.canvas.addEventListener("mousemove", this.canvasMouseMove);
                    this.canvas.addEventListener("mouseup", this.canvasMouseUp);
                    break;
                case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.setCursor:
                    this.canvas.style.cursor = data.cursor;
                    break;
            }
        };
        this.canvas = document.getElementById(htmlId);
        const offscreen = this.canvas.transferControlToOffscreen();
        this.worker = worker;
        this.offscreenCanvasTableId = offscreenCanvasTableId;
        this.worker.postMessage({
            mthbCanvasTable: offscreenCanvasTableId,
            type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.create,
            offscreen: offscreen,
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight,
            r: window.devicePixelRatio
        }, [offscreen]);
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
    expendAll() {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.expendAll
        });
    }
    collapseAll() {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.collapseAll
        });
    }
    setGroupBy(col) {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.setGroupBy,
            groupBy: col
        });
    }
    resize() {
        this.postMessage({
            mthbCanvasTable: this.offscreenCanvasTableId,
            type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.resize,
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight,
            r: window.devicePixelRatio
        });
    }
    postMessage(data) {
        this.worker.postMessage(data);
    }
}
exports.OffscreenCanvasTable = OffscreenCanvasTable;
