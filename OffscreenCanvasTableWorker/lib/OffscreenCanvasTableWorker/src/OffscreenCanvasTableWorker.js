"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCanvasTable_1 = require("../../share/CustomCanvasTable");
const ScrollView_1 = require("../../share/ScrollView");
const OffscreenCanvasTableMessage_1 = require("../../share/OffscreenCanvasTableMessage");
class OffscreenCanvasTableWorker extends CustomCanvasTable_1.CustomCanvasTable {
    drawCanvas() {
        if (this.context === undefined || this.dataIndex === undefined) {
            this.requestAnimationFrame = undefined;
            this.askForReDraw(this.drawconf);
            return;
        }
        super.drawCanvas();
    }
    setCanvasSize(width, height) {
        if (this.canvas === undefined) {
            return;
        }
        this.canvas.width = width;
        this.canvas.height = height;
        super.setCanvasSize(width, height);
    }
    constructor(offscreenCanvasTableId, col, config) {
        super(config);
        this.id = offscreenCanvasTableId;
        this.UpdateColumns(col);
    }
    message(data) {
        if (data.mthbCanvasTable !== this.id) {
            return;
        }
        switch (data.type) {
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.create:
                this.canvas = data.offscreen;
                this.setR(data.r);
                const context = this.canvas.getContext('2d');
                if (context === null) {
                    return;
                }
                this.scrollView = new ScrollView_1.ScrollView(context, this, this.config ? this.config.scrollView : undefined, this.askForExtentedMouseMoveAndMaouseUp, this.askForNormalMouseMoveAndMaouseUp);
                this.context = context;
                this.doReize(data.width, data.height);
                this.askForReDraw();
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.resize:
                this.setR(data.r);
                this.doReize(data.width, data.height);
                this.askForReDraw();
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.collapseAll:
                this.collapseAll();
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.expendAll:
                this.expendAll();
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.setGroupBy:
                this.setGroupBy(data.groupBy);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.scroll:
                this.wheel(data.deltaMode, data.deltaX, data.deltaY);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseDown:
                this.mouseDown(data.x, data.y);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseMove:
                this.mouseMove(data.x, data.y);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseUp:
                this.mouseUp(data.x, data.y);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseMoveExtended:
                this.mouseMoveExtended(data.x, data.y);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseUpExtended:
                this.mouseUpExtended(data.x, data.y);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.mouseLeave:
                this.mouseLeave();
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.TouchStart:
                this.TouchStart(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.TouchMove:
                this.TouchMove(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.TouchEnd:
                this.TouchEnd(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.keyDown:
                this.keydown(data.keycode);
                break;
        }
    }
    resize() { }
    setCursor(cursor) {
        const data = { mthbCanvasTable: this.id, type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.setCursor, cursor: cursor };
        postMessage(data);
    }
    askForExtentedMouseMoveAndMaouseUp() {
        const data = { mthbCanvasTable: this.id, type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.askForExtentedMouseMoveAndMaouseUp };
        postMessage(data);
    }
    askForNormalMouseMoveAndMaouseUp() {
        const data = { mthbCanvasTable: this.id, type: OffscreenCanvasTableMessage_1.OffscreenCanvasMesssageType.askForNormalMouseMoveAndMaouseUp };
        postMessage(data);
    }
}
exports.OffscreenCanvasTableWorker = OffscreenCanvasTableWorker;
//# sourceMappingURL=OffscreenCanvasTableWorker.js.map