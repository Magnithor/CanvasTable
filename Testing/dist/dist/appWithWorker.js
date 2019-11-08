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
/******/ 	return __webpack_require__(__webpack_require__.s = "./appWithWorker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../OffscreenCanvasTable/src/OffscreenCanvasTable.ts":
/*!***********************************************************!*\
  !*** ../OffscreenCanvasTable/src/OffscreenCanvasTable.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const OffscreenCanvasTableMessage_1 = __webpack_require__(/*! ../../share/OffscreenCanvasTableMessage */ "../share/OffscreenCanvasTableMessage.ts");
const CanvasTableTouchEvent_1 = __webpack_require__(/*! ../../share/CanvasTableTouchEvent */ "../share/CanvasTableTouchEvent.ts");
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


/***/ }),

/***/ "../share/CanvasTableTouchEvent.ts":
/*!*****************************************!*\
  !*** ../share/CanvasTableTouchEvent.ts ***!
  \*****************************************/
/*! no static exports found */
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


/***/ }),

/***/ "../share/OffscreenCanvasTableMessage.ts":
/*!***********************************************!*\
  !*** ../share/OffscreenCanvasTableMessage.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OffscreenCanvasMesssageType;
(function (OffscreenCanvasMesssageType) {
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["create"] = 0] = "create";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["resize"] = 1] = "resize";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["expendAll"] = 2] = "expendAll";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["collapseAll"] = 3] = "collapseAll";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["setGroupBy"] = 4] = "setGroupBy";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["scroll"] = 10] = "scroll";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["mouseDown"] = 20] = "mouseDown";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["mouseMove"] = 21] = "mouseMove";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["mouseUp"] = 22] = "mouseUp";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["mouseLeave"] = 23] = "mouseLeave";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["mouseMoveExtended"] = 24] = "mouseMoveExtended";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["mouseUpExtended"] = 25] = "mouseUpExtended";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["TouchStart"] = 30] = "TouchStart";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["TouchMove"] = 31] = "TouchMove";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["TouchEnd"] = 32] = "TouchEnd";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["keyDown"] = 40] = "keyDown";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["askForExtentedMouseMoveAndMaouseUp"] = 100] = "askForExtentedMouseMoveAndMaouseUp";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["askForNormalMouseMoveAndMaouseUp"] = 101] = "askForNormalMouseMoveAndMaouseUp";
    OffscreenCanvasMesssageType[OffscreenCanvasMesssageType["setCursor"] = 102] = "setCursor";
})(OffscreenCanvasMesssageType = exports.OffscreenCanvasMesssageType || (exports.OffscreenCanvasMesssageType = {}));


/***/ }),

/***/ "./appWithWorker.ts":
/*!**************************!*\
  !*** ./appWithWorker.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const OffscreenCanvasTable_1 = __webpack_require__(/*! ../OffscreenCanvasTable/src/OffscreenCanvasTable */ "../OffscreenCanvasTable/src/OffscreenCanvasTable.ts");
const worker = new Worker('dist/worker.js');
const canvasTable = new OffscreenCanvasTable_1.OffscreenCanvasTable(1, worker, "canvas");
worker.addEventListener('message', message => {
    console.log(message);
});
worker.postMessage('this is a test message to the worker');
var isGroup = true;
const group = function () {
    const expendedAll = document.getElementById("expendedAll");
    const collapseAll = document.getElementById("collapseAll");
    const groupDom = document.getElementById("group");
    if (!expendedAll || !collapseAll || !groupDom) {
        return;
    }
    if (isGroup) {
        canvasTable.setGroupBy();
        expendedAll.style.display = "none";
        collapseAll.style.display = "none";
        groupDom.innerText = "Group";
    }
    else {
        canvasTable.setGroupBy(["country", "subcountry"]);
        expendedAll.style.display = "";
        collapseAll.style.display = "";
        groupDom.innerText = "Ungroup";
    }
    isGroup = !isGroup;
};
group();
var w = window;
w.canvasTable = canvasTable;
w.group = group;


/***/ })

/******/ });
//# sourceMappingURL=appWithWorker.js.map