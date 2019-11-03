module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ScrollView_1 = __webpack_require__(2);
const CustomCanvasTable_1 = __webpack_require__(4);
const CanvasTableTouchEvent_1 = __webpack_require__(5);
class CanvasTable extends CustomCanvasTable_1.CustomCanvasTable {
    constructor(htmlId, data, col) {
        super();
        this.canvasWheel = (e) => {
            e.preventDefault();
            this.wheel(e.deltaMode, e.deltaX, e.deltaY);
        };
        this.canvasKeydown = (e) => {
            this.keydown(e.keyCode);
        };
        this.canvasTouchStart = (e) => {
            e.preventDefault();
            this.TouchStart(CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetTop, this.canvas.offsetLeft);
        };
        this.canvasTouchMove = (e) => {
            e.preventDefault();
            this.TouchMove(CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetTop, this.canvas.offsetLeft);
        };
        this.canvasTouchEnd = (e) => {
            e.preventDefault();
            this.TouchEnd(CanvasTableTouchEvent_1.TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetTop, this.canvas.offsetLeft);
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
        this.scrollView = new ScrollView_1.ScrollView(this.context, this, this.askForExtentedMouseMoveAndMaouseUp, this.askForNormalMouseMoveAndMaouseUp);
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
    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        super.setCanvasSize(width, height);
    }
}
exports.CanvasTable = CanvasTable;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CircularBuffer_1 = __webpack_require__(3);
class ScrollView {
    constructor(context, drawable, askForExtentedMouseMoveAndMaouseUp, askForNormalMouseMoveAndMaouseUp) {
        this.canvasWidth = -1;
        this.canvasHeight = -1;
        this.r = 1;
        this.hasScrollBarY = false;
        this.scrollBarThumbDownY = false;
        this.isOverScrollUpY = false;
        this.isOverScrollDownY = false;
        this.isOverScollThumbY = false;
        this.posYvalue = 0;
        this.scrollBarThumbMinY = -1;
        this.scrollBarThumbMaxY = -1;
        this.scrollBarPosMaxY = -1;
        this.pageY = -1;
        this.touchStartY = -1;
        this.hasScrollBarX = false;
        this.scrollBarThumbDownX = false;
        this.isOverScrollUpX = false;
        this.isOverScrollDownX = false;
        this.isOverScollThumbX = false;
        this.posXvalue = 0;
        this.scrollBarThumbMinX = -1;
        this.scrollBarThumbMaxX = -1;
        this.scrollBarPosMaxX = -1;
        this.pageX = -1;
        this.touchStartX = 1;
        this.scrollbarSize = 20;
        this.cellHeight = 20;
        this.run = false;
        this.runXOrY = false;
        this.runStart = -1;
        this.speed = 1;
        this.onScroll = (deltaMode, deltaX, deltaY) => {
            switch (deltaMode) {
                case 0: // DOM_DELTA_PIXEL	0x00	The delta values are specified in pixels.
                    this.posY += deltaY;
                    this.posX += deltaX;
                    break;
                case 1: // DOM_DELTA_LINE	0x01	The delta values are specified in lines.
                    this.posY += deltaY * this.cellHeight * this.r;
                    this.posX += deltaX * this.cellHeight * this.r;
                    break;
                case 2: // DOM_DELTA_PAGE	0x02	The delta values are specified in pages.
                    this.posY += deltaY * this.canvasHeight * this.r;
                    this.posX += deltaX * this.canvasWidth * this.r;
                    break;
                default:
                    // uups
                    return;
            }
            this.fixPos();
        };
        this.askForExtentedMouseMoveAndMaouseUp = askForExtentedMouseMoveAndMaouseUp;
        this.askForNormalMouseMoveAndMaouseUp = askForNormalMouseMoveAndMaouseUp;
        this.drawable = drawable;
        this.lastmove = new CircularBuffer_1.CircularBuffer(100, true);
        this.context = context;
    }
    get posY() {
        return this.posYvalue;
    }
    set posY(value) {
        if (!this.hasScrollBarY) {
            value = 0;
        }
        if (value <= 0) {
            value = 0;
        }
        else {
            if (value > this.scrollBarPosMaxY) {
                value = this.scrollBarPosMaxY;
            }
        }
        if (this.posYvalue != value) {
            this.posYvalue = value;
            this.drawable.askForReDraw();
        }
    }
    get posX() {
        return this.posXvalue;
    }
    set posX(value) {
        if (!this.hasScrollBarX) {
            value = 0;
        }
        if (value <= 0) {
            value = 0;
        }
        else {
            if (value > this.scrollBarPosMaxX) {
                value = this.scrollBarPosMaxX;
            }
        }
        if (this.posXvalue != value) {
            this.posXvalue = value;
            this.drawable.askForReDraw();
        }
    }
    setSize(r, canvasWidth, canvasHeight, width, height) {
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.width = width;
        this.height = height;
        this.r = r;
        if (this.height === undefined || this.width === undefined) {
            this.hasScrollBarX = false;
            this.hasScrollBarY = false;
            return;
        }
        if ((this.height / (this.canvasHeight - (18 + this.scrollbarSize) * this.r) > 1) && (this.width / (this.canvasWidth - this.scrollbarSize * this.r) > 1)) {
            // has X and Y
            this.pageY = this.height / (this.canvasHeight - (18 + this.scrollbarSize) * this.r);
            if (this.pageY < 1) {
                this.hasScrollBarY = false;
            }
            else {
                this.hasScrollBarY = true;
                this.scrollBarPosMaxY = this.height - (this.canvasHeight - (18 + this.scrollbarSize) * this.r);
            }
            this.pageX = this.width / (this.canvasWidth - this.scrollbarSize * this.r);
            if (this.pageX < 1) {
                this.hasScrollBarX = false;
            }
            else {
                this.hasScrollBarX = true;
                this.scrollBarPosMaxX = this.width - (this.canvasWidth - this.scrollbarSize * this.r);
            }
        }
        else {
            // has x or Y
            this.pageY = this.height / (this.canvasHeight - 18 * this.r);
            if (this.pageY < 1) {
                this.hasScrollBarY = false;
            }
            else {
                this.hasScrollBarY = true;
                this.scrollBarPosMaxY = this.height - (this.canvasHeight - 18 * this.r);
            }
            this.pageX = this.width / this.canvasWidth;
            if (this.pageX < 1) {
                this.hasScrollBarX = false;
            }
            else {
                this.hasScrollBarX = true;
                this.scrollBarPosMaxX = this.width - this.canvasWidth;
            }
        }
        if (this.posY > this.height - this.canvasWidth) {
            this.posY = this.height - this.canvasWidth;
        }
        if (this.posX > this.width - this.canvasWidth) {
            this.posX = this.width - this.canvasWidth;
        }
    }
    beforeDraw() {
        if (this.run) {
            if (this.runStart === -1) {
                if (this.runXOrY) {
                    this.posY -= (this.speed * this.r);
                }
                else {
                    this.posX -= (this.speed * this.r);
                }
                return true;
            }
            const time = (new Date()).getTime() - this.runStart;
            if (time < 1500) {
                if (this.runXOrY) {
                    this.posY -= (this.speed * this.r) * (1 - time / 1500);
                }
                else {
                    this.posX -= (this.speed * this.r) * (1 - time / 1500);
                }
                return true;
            }
        }
        return false;
    }
    OnKeydown(keyCode) {
        switch (keyCode) {
            case 33: // pagedown
                this.posY -= this.canvasHeight;
                return true;
            case 34: // pageup
                this.posY += this.canvasHeight;
                return true;
            case 38: // up
                this.posY -= this.cellHeight * this.r;
                return true;
            case 40: // down
                this.posY += this.cellHeight * this.r;
                return true;
            default:
                return false;
        }
    }
    OnTouchStart(e, offsetLeft, offsetTop) {
        this.run = false;
        this.lastmove.clear();
        const y = e.changedTouches[0].pageY - offsetTop;
        const x = e.changedTouches[0].pageX - offsetLeft;
        if (this.scrollClick(x, y, true)) {
            return true;
        }
        this.touchStartY = e.changedTouches[0].pageY;
        this.touchStartX = e.changedTouches[0].pageX;
        this.lastmove.push({ x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, time: new Date() });
        return false;
    }
    OnTouchMove(e, offsetLeft, offsetTop) {
        this.run = false;
        if (this.scrollBarThumbDownY) {
            const y = e.changedTouches[0].pageY - offsetTop;
            this.posY = this.scrollBarPosMaxY * ((y - 20) / (this.canvasHeight / this.r - 20 * 2));
            return;
        }
        if (this.scrollBarThumbDownX) {
            const x = e.changedTouches[0].pageX - offsetLeft;
            this.posX = this.scrollBarPosMaxX * (x / (this.canvasWidth / this.r - 20 * 2));
            return;
        }
        if (this.lastmove.size() === 0) {
            return;
        }
        this.lastmove.push({ x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, time: new Date() });
        this.posY -= (e.changedTouches[0].pageY - this.touchStartY) * this.r;
        this.posX -= (e.changedTouches[0].pageX - this.touchStartX) * this.r;
        this.touchStartY = e.changedTouches[0].pageY;
        this.touchStartX = e.changedTouches[0].pageX;
    }
    OnTouchEnd(e) {
        if (e.touches.length === 0) {
            let needToReDraw = false;
            if (this.isOverScollThumbY) {
                this.isOverScollThumbY = false;
                needToReDraw = true;
            }
            if (this.isOverScrollUpY) {
                this.isOverScrollUpY = false;
                needToReDraw = true;
            }
            if (this.isOverScrollDownY) {
                this.isOverScrollDownY = false;
                needToReDraw = true;
            }
            if (this.isOverScollThumbX) {
                this.isOverScollThumbX = false;
                needToReDraw = true;
            }
            if (this.isOverScrollUpX) {
                this.isOverScrollUpX = false;
                needToReDraw = true;
            }
            if (this.isOverScrollDownX) {
                this.isOverScrollDownX = false;
                needToReDraw = true;
            }
            if (needToReDraw) {
                this.drawMe();
            }
            this.scrollBarThumbDownY = false;
            this.scrollBarThumbDownX = false;
            if (this.run || this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = undefined;
                this.run = false;
            }
        }
        const list = this.lastmove.export();
        if (list.length > 2) {
            var i = list.length - 2;
            for (; i >= 0 && (list[list.length - 1].time.getTime() - list[i].time.getTime()) < 1000; i--) { }
            if (i < 0) {
                i = 0;
            }
            const time = list[list.length - 1].time.getTime() - list[i].time.getTime();
            const speedY = this.r * (list[list.length - 1].y - list[i].y) / time;
            if (Math.abs(speedY) > 1) {
                this.speed = speedY * 10;
                this.runXOrY = true;
                this.run = true;
                this.runStart = (new Date()).getTime();
                this.drawable.askForReDraw();
                return;
            }
            const speedX = this.r * (list[list.length - 1].x - list[i].x) / time;
            if (Math.abs(speedX) > 1) {
                this.speed = speedX * 10;
                this.runXOrY = false;
                this.run = true;
                this.runStart = (new Date()).getTime();
                this.drawable.askForReDraw();
                return;
            }
        }
    }
    onMouseLeave() {
        var needToReDraw = false;
        if (this.isOverScollThumbY && !this.scrollBarThumbDownY) {
            this.isOverScollThumbY = false;
            needToReDraw = true;
        }
        if (this.isOverScrollUpY) {
            this.isOverScrollUpY = false;
            needToReDraw = true;
        }
        if (this.isOverScrollDownY) {
            this.isOverScrollDownY = false;
            needToReDraw = true;
        }
        if (this.isOverScollThumbX && !this.scrollBarThumbDownX) {
            this.isOverScollThumbX = false;
            needToReDraw = true;
        }
        if (this.isOverScrollUpX) {
            this.isOverScrollUpX = false;
            needToReDraw = true;
        }
        if (this.isOverScrollDownX) {
            this.isOverScrollDownX = false;
            needToReDraw = true;
        }
        if (needToReDraw) {
            this.drawMe();
        }
    }
    onExtendedMouseUp(x, y) {
        this.askForNormalMouseMoveAndMaouseUp.call(this.drawable);
        this.scrollBarThumbDownY = false;
        this.scrollBarThumbDownX = false;
        if (this.isOverScollThumbY && (x > this.canvasWidth / this.r
            || (x < this.canvasWidth / this.r - this.scrollbarSize)
            || (this.scrollBarThumbMinY > y)
            || (y > this.scrollBarThumbMaxY))) {
            this.isOverScollThumbY = false;
            this.drawMe();
        }
        if (this.isOverScollThumbX && (y > this.canvasHeight / this.r
            || (y < this.canvasHeight / this.r - this.scrollbarSize)
            || (this.scrollBarThumbMinX > x)
            || (x > this.scrollBarThumbMaxX))) {
            this.isOverScollThumbY = false;
            this.drawMe();
        }
        return false;
    }
    onExtendedMouseMove(x, y) {
        if (this.scrollBarThumbDownY) {
            this.posY = this.scrollBarPosMaxY * ((y - 20) / (this.canvasHeight / this.r - 20 * 2));
        }
        if (this.scrollBarThumbDownX) {
            this.posX = this.scrollBarPosMaxX * (x / (this.canvasWidth / this.r - 20 * 2));
        }
        return true;
    }
    onMouseDown(x, y) {
        return this.scrollClick(x, y, false);
    }
    onMouseMove(x, y) {
        if (!this.hasScrollBarY && !this.hasScrollBarX) {
            return false;
        }
        const canvasWidth = this.canvasWidth / this.r;
        const canvasHeight = this.canvasHeight / this.r;
        if (this.hasScrollBarX && this.hasScrollBarY && x > canvasWidth - this.scrollbarSize && y > canvasHeight - this.scrollbarSize) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }
        if ((this.hasScrollBarX && this.hasScrollBarY && x < canvasWidth - this.scrollbarSize && y < canvasHeight - this.scrollbarSize) ||
            (!this.hasScrollBarX && this.hasScrollBarY && x < canvasWidth - this.scrollbarSize) ||
            (this.hasScrollBarX && !this.hasScrollBarY && y < canvasHeight - this.scrollbarSize)) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return false;
        }
        if (this.scrollBarThumbDownY) {
            this.posY = this.scrollBarPosMaxY * ((y - 20) / (this.canvasHeight / this.r - 20 * 2));
            return true;
        }
        if (this.scrollBarThumbDownX) {
            this.posX = this.scrollBarPosMaxX * ((x) / (this.canvasWidth / this.r - 20 * 2));
            return true;
        }
        if (this.hasScrollBarY && y < 20) {
            if (!this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = true;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }
        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y > this.canvasHeight / this.r - 20 - (this.hasScrollBarX ? this.scrollbarSize : 0)) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || !this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = true;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }
        if (this.hasScrollBarY && this.scrollBarThumbMinY <= y && y <= this.scrollBarThumbMaxY) {
            if (this.isOverScrollUpY || !this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = true;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }
        if (this.hasScrollBarX && x < 20) {
            if (!this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX || this.isOverScrollUpY || !this.isOverScollThumbY || this.isOverScrollDownY) {
                this.isOverScrollUpX = true;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.drawMe();
            }
            return true;
        }
        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x > this.canvasWidth / this.r - 20 - (this.hasScrollBarY ? this.scrollbarSize : 0)) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || !this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = true;
                this.drawMe();
            }
            return true;
        }
        if (this.hasScrollBarX && this.scrollBarThumbMinX <= x && x <= this.scrollBarThumbMaxX) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || !this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = true;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }
        if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
            this.isOverScrollUpY = false;
            this.isOverScollThumbY = false;
            this.isOverScrollDownY = false;
            this.isOverScrollUpX = false;
            this.isOverScollThumbX = false;
            this.isOverScrollDownX = false;
            this.drawMe();
            return true;
        }
        return true;
    }
    onMouseUp(x, y) {
        this.scrollBarThumbDownY = false;
        this.isOverScollThumbY = false;
        this.drawMe();
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
            this.run = false;
        }
        return false;
    }
    scrollClick(x, y, isTouch) {
        if (!this.hasScrollBarY && !this.hasScrollBarX) {
            return false;
        }
        const canvasWidth = this.canvasWidth / this.r;
        const canvasHeight = this.canvasHeight / this.r;
        if (this.hasScrollBarX && this.hasScrollBarY && x > canvasWidth - this.scrollbarSize && y > canvasHeight - this.scrollbarSize) {
            return true;
        }
        if ((this.hasScrollBarX && this.hasScrollBarY && x < canvasWidth - this.scrollbarSize && y < canvasHeight - this.scrollbarSize) ||
            (!this.hasScrollBarX && this.hasScrollBarY && x < canvasWidth - this.scrollbarSize) ||
            (this.hasScrollBarX && !this.hasScrollBarY && y < canvasHeight - this.scrollbarSize)) {
            return false;
        }
        if (this.hasScrollBarY && y < 20) {
            if (this.posY === 0) {
                return true;
            }
            this.posY -= this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = +7;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y > canvasHeight - 20 - (this.hasScrollBarX ? this.scrollbarSize : 0)) {
            if (this.posY === this.scrollBarPosMaxY) {
                return true;
            }
            this.posY += this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = -7;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y > this.scrollBarThumbMaxY) {
            this.posY += canvasHeight - 20;
            this.timeout = setTimeout(() => {
                this.speed = -14;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y < this.scrollBarThumbMinY) {
            this.posY -= canvasHeight - 20;
            this.timeout = setTimeout(() => {
                this.speed = +14;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize) {
            this.scrollBarThumbDownY = true;
        }
        if (this.hasScrollBarX && x < 20) {
            if (this.posX === 0) {
                return true;
            }
            this.posX -= this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = +7;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x > canvasWidth - 20 - (this.hasScrollBarY ? this.scrollbarSize : 0)) {
            if (this.posX === this.scrollBarPosMaxY) {
                return true;
            }
            this.posX += this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = -7;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x > this.scrollBarThumbMaxX) {
            this.posX += canvasHeight - 20;
            this.timeout = setTimeout(() => {
                this.speed = -14;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x < this.scrollBarThumbMinX) {
            this.posX -= canvasHeight - 20;
            this.timeout = setTimeout(() => {
                this.speed = +14;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }
        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize) {
            this.scrollBarThumbDownX = true;
        }
        if (!isTouch) {
            this.askForExtentedMouseMoveAndMaouseUp.call(this.drawable);
        }
        return true;
    }
    drawMe() {
        if (!this.drawable.isPlanToRedraw()) {
            this.draw();
        }
    }
    draw() {
        if (this.height === undefined || this.width === undefined) {
            return;
        }
        if (this.hasScrollBarY) {
            const canvasHeight = this.canvasHeight - (this.hasScrollBarX ? this.scrollbarSize * this.r : 0);
            const height = canvasHeight - this.r * 16 * 2;
            const ratioY = this.scrollBarPosMaxY === 0 ? 1 : (this.posY / this.scrollBarPosMaxY);
            const scrollBarSizeY = Math.max(10 * this.r, (height / this.pageY));
            const scrollBarPosY = 16 * this.r + ratioY * (height - scrollBarSizeY);
            this.scrollBarThumbMinY = scrollBarPosY / this.r;
            this.scrollBarThumbMaxY = (scrollBarPosY + scrollBarSizeY) / this.r;
            this.context.fillStyle = '#f0f0f0';
            this.context.fillRect(this.canvasWidth - this.r * this.scrollbarSize, 0, this.r * this.scrollbarSize, canvasHeight);
            this.context.fillStyle = this.isOverScrollUpY ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(this.canvasWidth - this.r * 10, this.r * 3);
            this.context.lineTo(this.canvasWidth - this.r * 18, this.r * 13);
            this.context.lineTo(this.canvasWidth - this.r * 2, this.r * 13);
            this.context.fill();
            this.context.fillStyle = this.isOverScrollDownY ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(this.canvasWidth - this.r * 10, canvasHeight - this.r * 3);
            this.context.lineTo(this.canvasWidth - this.r * 18, canvasHeight - this.r * 13);
            this.context.lineTo(this.canvasWidth - this.r * 2, canvasHeight - this.r * 13);
            this.context.fill();
            this.context.fillStyle = this.isOverScollThumbY ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(this.canvasWidth - this.r * this.scrollbarSize, scrollBarPosY);
            this.context.lineTo(this.canvasWidth, scrollBarPosY);
            this.context.lineTo(this.canvasWidth, scrollBarPosY + scrollBarSizeY);
            this.context.lineTo(this.canvasWidth - this.r * this.scrollbarSize, scrollBarPosY + scrollBarSizeY);
            this.context.fill();
        }
        if (this.hasScrollBarX) {
            const canvasWidth = this.canvasWidth - (this.hasScrollBarY ? this.scrollbarSize * this.r : 0);
            const width = canvasWidth - this.r * 16 * 2;
            const ratioX = this.scrollBarPosMaxX === 0 ? 1 : (this.posX / this.scrollBarPosMaxX);
            const scrollBarSizeX = Math.max(10 * this.r, (width / this.pageX));
            const scrollBarPosX = 16 * this.r + ratioX * (width - scrollBarSizeX);
            this.scrollBarThumbMinX = scrollBarPosX / this.r;
            this.scrollBarThumbMaxX = (scrollBarPosX + scrollBarSizeX) / this.r;
            this.context.fillStyle = '#f0f0f0';
            this.context.fillRect(0, this.canvasHeight - this.r * this.scrollbarSize, canvasWidth, this.r * this.scrollbarSize);
            this.context.fillStyle = this.isOverScrollUpX ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(this.r * 3, this.canvasHeight - this.r * 10);
            this.context.lineTo(this.r * 13, this.canvasHeight - this.r * 18);
            this.context.lineTo(this.r * 13, this.canvasHeight - this.r * 2);
            this.context.fill();
            this.context.fillStyle = this.isOverScrollDownX ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(canvasWidth - this.r * 3, this.canvasHeight - this.r * 10);
            this.context.lineTo(canvasWidth - this.r * 13, this.canvasHeight - this.r * 18);
            this.context.lineTo(canvasWidth - this.r * 13, this.canvasHeight - this.r * 2);
            this.context.fill();
            this.context.fillStyle = this.isOverScollThumbX ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(scrollBarPosX, this.canvasHeight - this.r * this.scrollbarSize);
            this.context.lineTo(scrollBarPosX, this.canvasHeight);
            this.context.lineTo(scrollBarPosX + scrollBarSizeX, this.canvasHeight);
            this.context.lineTo(scrollBarPosX + scrollBarSizeX, this.canvasHeight - this.r * this.scrollbarSize);
            this.context.fill();
        }
        if (this.hasScrollBarX && this.hasScrollBarY) {
            this.context.fillStyle = '#f0f0f0';
            this.context.fillRect(this.canvasWidth - this.r * this.scrollbarSize, this.canvasHeight - this.r * this.scrollbarSize, this.r * this.scrollbarSize, this.r * this.scrollbarSize);
        }
    }
    fixPos() {
        if (!this.hasScrollBarY) {
            this.posY = 0;
            return;
        }
        if (this.posY < 0) {
            this.posY = 0;
        }
        else {
            if (this.posY > this.scrollBarPosMaxY) {
                this.posY = this.scrollBarPosMaxY;
            }
        }
    }
}
exports.ScrollView = ScrollView;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Align;
(function (Align) {
    Align[Align["left"] = 0] = "left";
    Align[Align["center"] = 1] = "center";
    Align[Align["right"] = 2] = "right";
})(Align = exports.Align || (exports.Align = {}));
var Sort;
(function (Sort) {
    Sort[Sort["ascending"] = 1] = "ascending";
    Sort[Sort["descending"] = -1] = "descending";
})(Sort = exports.Sort || (exports.Sort = {}));
var ItemIndexType;
(function (ItemIndexType) {
    ItemIndexType[ItemIndexType["GroupItems"] = 0] = "GroupItems";
    ItemIndexType[ItemIndexType["Index"] = 1] = "Index";
})(ItemIndexType = exports.ItemIndexType || (exports.ItemIndexType = {}));
class CustomCanvasTable {
    constructor() {
        this.needToCalc = true;
        this.needToCalcFont = true;
        this.r = 1;
        this.data = [];
        this.minFontWidth = 1;
        this.maxFontWidth = 1;
        this.font = "arial";
        this.cellHeight = 20;
        this.dataIndex = undefined;
        this.column = [];
        this.orgColum = [];
        this.canvasHeight = 0;
        this.canvasWidth = 0;
    }
    isPlanToRedraw() {
        if (!this.requestAnimationFrame) {
            return false;
        }
        return (this.drawconf !== undefined && this.drawconf.fulldraw);
    }
    askForReDraw(config) {
        if (config === undefined || (this.drawconf !== undefined && this.drawconf.fulldraw)) {
            this.drawconf = { fulldraw: true };
        }
        else {
            if (this.drawconf === undefined) {
                this.drawconf = Object.assign(Object.assign({}, config), { fulldraw: false });
            }
            else {
                // this.drawconf = ...this.drawconf, ...config;
            }
        }
        if (this.requestAnimationFrame) {
            return;
        }
        this.requestAnimationFrame = requestAnimationFrame(() => {
            this.drawCanvas();
        });
    }
    setFilter(filter) {
        if (filter === null) {
            filter = undefined;
        }
        if (this.cusomFilter !== filter) {
            this.cusomFilter = filter;
            this.calcIndex();
            this.askForReDraw();
        }
    }
    setCustomSort(customSort) {
        if (customSort === null) {
            customSort = undefined;
        }
        this.customSort = customSort;
        this.sortCol = undefined;
        this.calcIndex();
        this.askForReDraw();
    }
    setSort(sortCol) {
        this.sortCol = sortCol;
        this.customSort = undefined;
        this.calcIndex();
        this.askForReDraw();
    }
    setGroupBy(col) {
        this.groupByCol = col;
        this.calcIndex();
        this.askForReDraw();
    }
    setData(data) {
        if (data !== undefined) {
            this.data = data;
        }
        this.calcIndex();
        this.askForReDraw();
    }
    setColumnVisible(col, visible) {
        if (col < 0 || col >= this.orgColum.length) {
            throw "out of range";
        }
        if (visible && this.orgColum[col].visible === true) {
            return;
        }
        if (!visible && !this.orgColum[col].visible) {
            return;
        }
        this.orgColum[col].visible = visible;
        this.UpdateColumns(this.orgColum);
    }
    UpdateColumns(col) {
        this.orgColum = col;
        this.column = [];
        for (let i = 0; i < col.length; i++) {
            if (col[i].visible === false) {
                continue;
            }
            this.column[this.column.length] = Object.assign({
                align: Align.left,
                leftPos: 0,
                width: 50,
            }, col[i]);
        }
        this.needToCalc = true;
        this.resize();
        this.calcColum();
    }
    calcColum() {
        this.needToCalc = false;
        let leftPos = 0;
        for (let i = 0; i < this.column.length; i++) {
            this.column[i].leftPos = leftPos;
            leftPos += this.column[i].width * this.r;
        }
        this.reCalcForScrollView();
    }
    setR(r) {
        if (this.r === r) {
            return;
        }
        this.r = r;
        this.needToCalc = true;
        this.needToCalcFont = true;
    }
    expendedAll() {
        if (this.dataIndex === undefined) {
            return;
        }
        if (this.dataIndex.type === ItemIndexType.GroupItems) {
            this.changeChildExpended(this.dataIndex, true);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }
    collapseAll() {
        if (this.dataIndex === undefined) {
            return;
        }
        if (this.dataIndex.type === ItemIndexType.GroupItems) {
            this.changeChildExpended(this.dataIndex, false);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }
    wheel(deltaMode, deltaX, deltaY) {
        if (this.scrollView) {
            this.scrollView.onScroll(deltaMode, deltaX, deltaY);
        }
    }
    mouseDown(x, y) {
        if (this.dataIndex === undefined) {
            return;
        }
        if (this.scrollView && this.scrollView.onMouseDown(x, y)) {
            return;
        }
        if (this.dataIndex.type === ItemIndexType.GroupItems && y > 18) {
            const result = this.findByPos(y);
            if (result !== null && typeof result === "object") {
                result.isExpended = !result.isExpended;
                this.askForReDraw();
                this.reCalcForScrollView();
                return;
            }
        }
    }
    mouseMove(x, y) {
        if (this.scrollView && this.scrollView.onMouseMove(x, y)) {
            this.overRow = undefined;
            return;
        }
        if (y < 18) {
            this.overRow = undefined;
            return;
        }
        else {
            const result = this.findByPos(y);
            if (typeof result === "number") {
                this.overRow = result;
                return;
            }
            this.overRow = undefined;
        }
    }
    mouseUp(x, y) {
        if (this.scrollView && this.scrollView.onMouseUp(x, y)) {
            return;
        }
    }
    mouseMoveExtended(x, y) {
        if (this.scrollView && this.scrollView.onExtendedMouseMove(x, y)) {
            return;
        }
    }
    mouseUpExtended(x, y) {
        if (this.scrollView && this.scrollView.onExtendedMouseUp(x, y)) {
            return;
        }
    }
    mouseLeave() {
        this.overRow = undefined;
        if (this.scrollView) {
            this.scrollView.onMouseLeave();
        }
    }
    keydown(keycode) {
        if (this.scrollView && this.scrollView.OnKeydown(keycode)) {
            this.overRow = undefined;
        }
    }
    TouchStart(e, offsetLeft, offsetTop) {
        if (this.scrollView && this.scrollView.OnTouchStart(e, offsetLeft, offsetTop)) {
            return;
        }
        if (this.dataIndex === undefined) {
            return;
        }
        if (this.dataIndex.type === ItemIndexType.GroupItems) {
            if (e.changedTouches.length === 1) {
                const y = e.changedTouches[0].pageY - offsetTop;
                if (y > 18) {
                    this.touchClick = { timeout: setTimeout(() => {
                            const result = this.findByPos(y);
                            if (result !== null && typeof result === "object") {
                                result.isExpended = !result.isExpended;
                                this.askForReDraw();
                                this.reCalcForScrollView();
                                return;
                            }
                        }, 250), x: e.changedTouches[0].pageX - offsetLeft, y: y };
                }
                else {
                    this.clearTouchClick();
                }
            }
            else {
                this.clearTouchClick();
            }
        }
    }
    TouchMove(e, offsetLeft, offsetTop) {
        if (this.scrollView) {
            this.scrollView.OnTouchMove(e, offsetLeft, offsetTop);
        }
        if (this.touchClick) {
            if (e.changedTouches.length !== 1) {
                this.clearTouchClick();
                return;
            }
            const y = e.changedTouches[0].pageY - offsetTop;
            const x = e.changedTouches[0].pageX - offsetLeft;
            if (Math.abs(x - this.touchClick.x) > 4 || Math.abs(y - this.touchClick.y) > 4) {
                this.clearTouchClick();
            }
        }
    }
    TouchEnd(e, offsetLeft, offsetTop) {
        if (this.scrollView) {
            this.scrollView.OnTouchEnd(e);
        }
    }
    clearTouchClick() {
        if (this.touchClick) {
            clearTimeout(this.touchClick.timeout);
            this.touchClick = undefined;
        }
    }
    findByPos(y) {
        if (this.dataIndex === undefined || this.scrollView === undefined) {
            return null;
        }
        let pos = -this.scrollView.posY / this.r + 18;
        const cellHeight = this.cellHeight;
        const maxHeight = this.canvasHeight / this.r;
        let find = function (items) {
            let i;
            if (items.type === ItemIndexType.Index) {
                const h = items.list.length * cellHeight;
                if (y > pos + h) {
                    pos += h;
                }
                else {
                    i = Math.trunc((-pos + y) / cellHeight);
                    pos += i * cellHeight;
                    return i < items.list.length ? items.list[i] : null;
                }
            }
            else {
                for (i = 0; i < items.list.length; i++) {
                    if (pos < y && y < pos + cellHeight) {
                        return items.list[i];
                    }
                    pos += cellHeight;
                    if (!items.list[i].isExpended) {
                        continue;
                    }
                    let f = find(items.list[i].child);
                    if (f !== null) {
                        return f;
                    }
                }
            }
            return null;
        };
        return find(this.dataIndex);
    }
    set overRow(value) {
        if (value != this.overRowValue) {
            const temp = this.overRowValue;
            this.overRowValue = value;
            if (value !== undefined && temp !== undefined) {
                this.askForReDraw({ drawOnly: [temp, value] });
                return;
            }
            if (value !== undefined) {
                this.askForReDraw({ drawOnly: [value] });
                return;
            }
            if (temp !== undefined) {
                this.askForReDraw({ drawOnly: [temp] });
                return;
            }
        }
    }
    calcIndex() {
        if (this.data === undefined) {
            return;
        }
        let index = [];
        if (this.cusomFilter) {
            for (let i = 0; i < this.data.length; i++) {
                if (this.cusomFilter(this.data, this.data[i], this.orgColum)) {
                    index[index.length] = i;
                }
            }
        }
        else {
            for (let i = 0; i < this.data.length; i++) {
                index[index.length] = i;
            }
        }
        if (this.customSort) {
            const customSort = this.customSort;
            index.sort((a, b) => {
                return customSort(this.data, this.data[a], this.data[b]);
            });
        }
        else {
            const sortCol = this.sortCol;
            if (sortCol && sortCol.length) {
                index.sort((a, b) => {
                    for (let i = 0; i < sortCol.length; i++) {
                        let d, col = sortCol[i];
                        switch (col.col.field) {
                            case "__rownum__":
                                d = a - b;
                                if (d !== 0) {
                                    return d * col.sort;
                                }
                                break;
                            default:
                                let da = this.data[a][col.col.field], db = this.data[b][col.col.field];
                                if (da === undefined) {
                                    if (db === undefined) {
                                        continue;
                                    }
                                    return col.sort;
                                }
                                if (db === undefined) {
                                    return -1 * col.sort;
                                }
                                if (typeof da === "string" && typeof db === "string") {
                                    d = da.localeCompare(db);
                                    if (d !== 0) {
                                        return d * col.sort;
                                    }
                                    continue;
                                }
                                if (da > db) {
                                    return col.sort;
                                }
                                if (da < db) {
                                    return -1 * col.sort;
                                }
                        }
                    }
                    return 0;
                });
            }
        }
        if (this.groupByCol && this.groupByCol.length > 0) {
            const groupByCol = this.groupByCol;
            let groupItems = { type: ItemIndexType.GroupItems, list: [] };
            this.group(groupItems, index, 0, groupByCol, this.dataIndex === undefined || this.dataIndex.type === ItemIndexType.Index ? undefined : this.dataIndex);
            this.dataIndex = groupItems;
        }
        else {
            this.dataIndex = { type: ItemIndexType.Index, list: index };
        }
        this.reCalcForScrollView();
    }
    tryFind(idx, c) {
        if (idx === undefined) {
            return undefined;
        }
        for (let i = 0; i < idx.list.length; i++) {
            if (idx.list[i].caption === c) {
                return idx.list[i];
            }
        }
        return undefined;
    }
    group(g, index, level, groupByCol, old) {
        let r = new Map();
        let p = new Map();
        for (let i = 0; i < index.length; i++) {
            const id = index[i];
            let c = String(this.data[id][groupByCol[level]]);
            let d = r.get(c);
            if (d !== undefined) {
                const item = g.list[d];
                if (item.child.type === ItemIndexType.Index) {
                    item.child.list.push(id);
                }
            }
            else {
                r.set(c, g.list.length);
                const oldGroupItem = this.tryFind(old, c);
                g.list.push({ caption: c, isExpended: oldGroupItem === undefined ? false : oldGroupItem.isExpended, child: { type: ItemIndexType.Index, list: [id] } });
            }
        }
        level++;
        if (groupByCol.length > level) {
            for (let i = 0; i < g.list.length; i++) {
                const child = g.list[i].child;
                if (child.type === ItemIndexType.Index) {
                    let item = { type: ItemIndexType.GroupItems, list: [] };
                    const oldGroupItem = this.tryFind(old, g.list[i].caption);
                    this.group(item, child.list, level, groupByCol, oldGroupItem === undefined || oldGroupItem.child.type === ItemIndexType.Index ? undefined : oldGroupItem.child);
                    g.list[i].child = item;
                }
            }
        }
    }
    changeChildExpended(g, value) {
        for (let i = 0; i < g.list.length; i++) {
            g.list[i].isExpended = value;
            const child = g.list[i].child;
            if (child.type === ItemIndexType.GroupItems) {
                this.changeChildExpended(child, value);
            }
        }
    }
    reCalcForScrollView() {
        if (this.dataIndex === undefined) {
            return;
        }
        let w = 1;
        if (this.column) {
            for (let i = 0; i < this.column.length; i++) {
                w += this.column[i].width * this.r + 2;
            }
        }
        else {
            w = undefined;
        }
        let h = 0;
        const cellHeight = this.cellHeight;
        let calc = function (index) {
            switch (index.type) {
                case ItemIndexType.Index:
                    h += cellHeight * index.list.length;
                    break;
                case ItemIndexType.GroupItems:
                    for (let i = 0; i < index.list.length; i++) {
                        h += cellHeight;
                        if (index.list[i].isExpended) {
                            calc(index.list[i].child);
                        }
                    }
                    break;
            }
        };
        calc(this.dataIndex);
        if (this.scrollView) {
            this.scrollView.setSize(this.r, this.canvasWidth, this.canvasHeight, w, h * this.r);
        }
    }
    setCanvasSize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.reCalcForScrollView();
    }
    doReize(width, height) {
        this.setCanvasSize(width * this.r, height * this.r);
    }
    drawCanvas() {
        if (!this.scrollView || !this.context || !this.dataIndex) {
            return;
        }
        if (this.needToCalc) {
            this.calcColum();
        }
        if (this.needToCalcFont) {
            this.context.font = 14 * this.r + "px " + this.font;
            this.minFontWidth = this.context.measureText('i').width;
            this.maxFontWidth = this.context.measureText('Æ').width;
        }
        if (this.drawconf !== undefined && this.drawconf.fulldraw) {
            this.drawconf = undefined;
        }
        const drawConf = this.drawconf;
        this.drawconf = undefined;
        this.requestAnimationFrame = undefined;
        if (this.scrollView.beforeDraw()) {
            this.askForReDraw();
        }
        const headderHeight = 18 * this.r;
        const offsetLeft = 5 * this.r;
        if (drawConf === undefined) {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        this.context.font = 14 * this.r + "px " + this.font;
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';
        const colStart = 0;
        const colEnd = this.column.length;
        const height = this.cellHeight * this.r;
        let index = this.dataIndex;
        let pos, i, maxPos;
        switch (index.type) {
            case ItemIndexType.Index:
                maxPos = this.canvasHeight + this.cellHeight + 5 * this.r;
                i = Math.floor(this.scrollView.posY / (height));
                pos = (-this.scrollView.posY + (i + 1) * height);
                pos += 14 * this.r;
                while (pos < maxPos) {
                    if (i < index.list.length) {
                        this.drawRowItem(index.list[i], i, pos, height, offsetLeft, colStart, colEnd, drawConf);
                    }
                    pos += height;
                    i++;
                }
                this.context.beginPath();
                let leftPos = 0;
                for (let col = 0; col < this.column.length; col++) {
                    leftPos += this.column[col].width * this.r;
                    this.context.moveTo(leftPos, headderHeight);
                    this.context.lineTo(leftPos, this.canvasHeight);
                }
                this.context.stroke();
                break;
            case ItemIndexType.GroupItems:
                pos = -this.scrollView.posY;
                maxPos = this.canvasHeight + this.cellHeight + 5 * this.r;
                pos += 14 * this.r + height;
                i = 0;
                while (pos < maxPos && index.list.length > i) {
                    const item = index.list[i];
                    pos = this.drawGroupItem(1, item, pos, height, maxPos, offsetLeft, colStart, colEnd, drawConf);
                    i++;
                }
                break;
        }
        // Headder
        pos = 14 * this.r;
        this.context.clearRect(0, 0, this.canvasWidth, headderHeight);
        this.context.beginPath();
        let leftPos = 0;
        for (let col = colStart; col < colEnd; col++) {
            leftPos += this.column[col].width * this.r;
            this.context.moveTo(-this.scrollView.posX + leftPos, 0);
            this.context.lineTo(-this.scrollView.posX + leftPos, headderHeight);
        }
        this.context.stroke();
        this.context.textAlign = 'left';
        for (let col = colStart; col < colEnd; col++) {
            this.context.fillText(this.column[col].header, -this.scrollView.posX + this.column[col].leftPos + offsetLeft, pos);
        }
        this.context.beginPath();
        this.context.moveTo(0, pos + 4 * this.r);
        this.context.lineTo(this.canvasWidth, pos + 4 * this.r);
        this.context.stroke();
        this.scrollView.draw();
    }
    drawGroupItem(level, groupItem, pos, height, maxPos, offsetLeft, colStart, colEnd, drawConf) {
        if (!this.scrollView || !this.context) {
            return 0;
        }
        if (pos > 0 && drawConf === undefined) {
            this.context.textAlign = 'left';
            this.context.fillText(groupItem.caption + ' (' + groupItem.child.list.length + ')', -this.scrollView.posX + 10 * level * this.r, pos);
        }
        pos += height;
        if (groupItem.isExpended) {
            const child = groupItem.child;
            let i;
            if (child.type === ItemIndexType.Index) {
                if (0 > pos + child.list.length * height) {
                    pos += child.list.length * height;
                }
                else {
                    i = 0;
                    if (pos < -height) {
                        i = Math.trunc(-pos / height);
                        pos += i * height;
                    }
                    if (drawConf === undefined) {
                        this.context.strokeStyle = 'black';
                        this.context.beginPath();
                        this.context.moveTo(0, pos + 4 * this.r + 1 - height);
                        this.context.lineTo(this.column[this.column.length - 1].leftPos + this.column[this.column.length - 1].width * this.r, pos + 4 * this.r + 1 - height);
                        this.context.stroke();
                    }
                    for (; i < child.list.length && pos < maxPos; i++) {
                        const item = child.list[i];
                        if (pos > 0) {
                            this.drawRowItem(item, i, pos, height, offsetLeft, colStart, colEnd, drawConf);
                        }
                        pos += height;
                    }
                }
            }
            else {
                for (i = 0; i < child.list.length && pos < maxPos; i++) {
                    const item = child.list[i];
                    pos = this.drawGroupItem(level + 1, item, pos, height, maxPos, offsetLeft, colStart, colEnd, drawConf);
                }
            }
        }
        return pos;
    }
    drawRowItem(indexId, i, pos, height, offsetLeft, colStart, colEnd, drawConf) {
        if (!this.scrollView || !this.context) {
            return 0;
        }
        if (drawConf !== undefined && drawConf.drawOnly !== undefined) {
            let found = false;
            for (let i = 0; i < drawConf.drawOnly.length; i++) {
                if (drawConf.drawOnly[i] === indexId) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return;
            }
            else {
                this.context.clearRect(0, pos - height + 4 * this.r + 1, this.canvasWidth, height - 2);
            }
        }
        for (let col = colStart; col < colEnd; col++) {
            const colItem = this.column[col];
            let data;
            switch (colItem.field) {
                case "__rownum__":
                    data = indexId.toString();
                    break;
                case "__idxnum__":
                    data = i.toString();
                    break;
                default:
                    data = this.data[indexId][colItem.field];
            }
            if (colItem.customData) {
                data = colItem.customData(this, data, this.data[indexId], this.data, indexId, colItem);
            }
            if (colItem.renderer) {
                const left = -this.scrollView.posX + colItem.leftPos + 1;
                const top = pos - height + 4 * this.r + 1;
                const width = colItem.width * this.r - 2;
                const h = height - 2;
                this.context.save();
                this.context.beginPath();
                this.context.rect(left, top, width, h);
                this.context.clip();
                try {
                    colItem.renderer(this, this.context, indexId, this.orgColum[col], left, top, left + width, top + h, width, h, this.r, data, this.data[indexId], this.data);
                }
                catch (e) {
                    console.log("CanvasTable renderer", colItem.header, e);
                }
                this.context.restore();
                continue;
            }
            let needClip;
            const colWidth = colItem.width * this.r - offsetLeft * 2;
            if (data === null) {
                return;
            }
            if (colWidth > data.length * this.maxFontWidth) {
                needClip = false;
            }
            else if (colWidth < data.length * this.minFontWidth) {
                needClip = true;
            }
            else {
                needClip = colWidth < this.context.measureText(data).width;
            }
            let x;
            switch (colItem.align) {
                case Align.left:
                default:
                    x = colItem.leftPos + offsetLeft;
                    if (this.context.textAlign !== 'left') {
                        this.context.textAlign = 'left';
                    }
                    break;
                case Align.right:
                    x = colItem.leftPos + colItem.width * this.r - offsetLeft;
                    if (this.context.textAlign !== 'right') {
                        this.context.textAlign = 'right';
                    }
                    break;
                case Align.center:
                    x = colItem.leftPos + colItem.width * this.r * 0.5 - offsetLeft;
                    if (this.context.textAlign !== 'center') {
                        this.context.textAlign = 'center';
                    }
                    break;
            }
            if (this.overRowValue === indexId) {
                this.context.fillStyle = '#DCDCDC';
            }
            else {
                this.context.fillStyle = i % 2 === 0 ? '#ECECEC' : 'white';
            }
            if (needClip) {
                this.context.fillRect(-this.scrollView.posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1, colItem.width * this.r - 1 * 2, height - 3);
                this.context.save();
                this.context.beginPath();
                this.context.rect(-this.scrollView.posX + colItem.leftPos + offsetLeft, pos - height, colItem.width * this.r - offsetLeft * 2, height);
                this.context.clip();
                this.context.fillStyle = 'black';
                this.context.fillText(data, -this.scrollView.posX + x, pos);
                this.context.restore();
            }
            else {
                this.context.fillRect(-this.scrollView.posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1, colItem.width * this.r - 1 * 2, height - 3);
                this.context.fillStyle = 'black';
                this.context.fillText(data, -this.scrollView.posX + x, pos);
            }
            // Ætti að gerast fyrri ofan og lengri línur
            this.context.beginPath();
            this.context.moveTo(-this.scrollView.posX + colItem.leftPos + colItem.width * this.r, pos - height + 4 * this.r);
            this.context.lineTo(-this.scrollView.posX + colItem.leftPos + colItem.width * this.r, pos + 4 * this.r);
            this.context.stroke();
        }
        if (drawConf === undefined) {
            this.context.beginPath();
            this.context.moveTo(0, pos + 4 * this.r);
            this.context.lineTo(this.column[this.column.length - 1].leftPos + this.column[this.column.length - 1].width * this.r, pos + 4 * this.r);
            this.context.stroke();
        }
    }
}
exports.CustomCanvasTable = CustomCanvasTable;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
;
function TouchEventToCanvasTableTouchEvent(e) {
    const x = { changedTouches: [], touches: [] };
    for (var i = 0; i < e.changedTouches.length; i++) {
        x.changedTouches.push({
            pageX: e.changedTouches[i].pageX,
            pageY: e.changedTouches[i].pageY
        });
    }
    for (var i = 0; i < e.touches.length; i++) {
        x.touches.push({
            pageX: e.touches[i].pageX,
            pageY: e.touches[i].pageY
        });
    }
    return x;
}
exports.TouchEventToCanvasTableTouchEvent = TouchEventToCanvasTableTouchEvent;


/***/ })
/******/ ]);