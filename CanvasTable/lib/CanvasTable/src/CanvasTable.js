"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScrollView_1 = require("./../../share/ScrollView");
const CustomCanvasTable_1 = require("./../../share/CustomCanvasTable");
const CanvasTableTouchEvent_1 = require("./../../share/CanvasTableTouchEvent");
const CanvasTableColum_1 = require("../../share/CanvasTableColum");
exports.Align = CanvasTableColum_1.Align;
exports.Sort = CanvasTableColum_1.Sort;
class CanvasTable extends CustomCanvasTable_1.CustomCanvasTable {
    constructor(htmlId, data, col, config) {
        super(config);
        this.canvasWheel = (e) => {
            e.preventDefault();
            this.wheel(e.deltaMode, e.deltaX, e.deltaY);
        };
        this.canvasKeydown = (e) => {
            this.keydown(e.keyCode);
        };
        this.canvasTouchStart = (e) => {
            e.preventDefault();
            this.TouchStart(CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetLeft, this.canvas.offsetTop);
        };
        this.canvasTouchMove = (e) => {
            e.preventDefault();
            this.TouchMove(CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetLeft, this.canvas.offsetTop);
        };
        this.canvasTouchEnd = (e) => {
            e.preventDefault();
            this.TouchEnd(CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetLeft, this.canvas.offsetTop);
        };
        this.canvasMouseDown = (e) => {
            e.preventDefault();
            this.mouseDown(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        };
        this.canvasMouseLeave = () => {
            this.mouseLeave();
        };
        this.canvasMouseUp = (e) => {
            e.preventDefault();
            this.mouseUp(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        };
        this.canvasMouseUpExtended = (e) => {
            e.preventDefault();
            this.mouseUpExtended(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        };
        this.canvasMouseMoveExtended = (e) => {
            e.preventDefault();
            this.mouseMoveExtended(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        };
        this.canvasMouseMove = (e) => {
            e.preventDefault();
            const x = e.clientX - this.canvas.offsetLeft;
            const y = e.clientY - this.canvas.offsetTop;
            this.mouseMove(x, y);
        };
        this.data = data;
        this.canvas = document.getElementById(htmlId);
        const context = this.canvas.getContext("2d");
        if (context === null) {
            throw "context is null";
        }
        this.setR(window.devicePixelRatio);
        this.doReize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.context = context;
        this.scrollView = new ScrollView_1.ScrollView(this.context, this, config ? config.scrollView : undefined, this.askForExtentedMouseMoveAndMaouseUp, this.askForNormalMouseMoveAndMaouseUp);
        this.calcIndex();
        this.canvas.addEventListener("wheel", this.canvasWheel);
        this.canvas.addEventListener("mousedown", this.canvasMouseDown);
        this.canvas.addEventListener("mousemove", this.canvasMouseMove);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp);
        this.canvas.addEventListener("mouseleave", this.canvasMouseLeave);
        this.canvas.addEventListener("touchstart", this.canvasTouchStart);
        this.canvas.addEventListener("touchmove", this.canvasTouchMove);
        this.canvas.addEventListener("touchend", this.canvasTouchEnd);
        this.canvas.addEventListener("keydown", this.canvasKeydown);
        this.UpdateColumns(col);
        window.addEventListener("resize", () => {
            this.resize();
        });
    }
    askForExtentedMouseMoveAndMaouseUp() {
        this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
        this.canvas.removeEventListener("mouseup", this.canvasMouseUp);
        window.addEventListener("mousemove", this.canvasMouseMoveExtended);
        window.addEventListener("mouseup", this.canvasMouseUpExtended);
    }
    askForNormalMouseMoveAndMaouseUp() {
        window.removeEventListener("mousemove", this.canvasMouseMoveExtended);
        window.removeEventListener("mouseup", this.canvasMouseUpExtended);
        this.canvas.addEventListener("mousemove", this.canvasMouseMove);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp);
    }
    resize() {
        this.setR(window.devicePixelRatio);
        this.doReize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.reCalcForScrollView();
        this.askForReDraw();
    }
    setCursor(cursor) {
        this.canvas.style.cursor = cursor;
    }
    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        super.setCanvasSize(width, height);
    }
}
exports.CanvasTable = CanvasTable;
