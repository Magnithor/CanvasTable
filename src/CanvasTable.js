"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CircularBuffer_1 = require("../../node_modules/mthb-circular-buffer/lib/CircularBuffer");
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
class CanvasTable {
    constructor(htmlId, data, col) {
        this.scrollBarThumbDown = false;
        this.hasScrollBar = false;
        this.run = false;
        this.cellHeight = 20;
        this.scrollbarSize = 20;
        this.canvasKeydown = (e) => {
            switch (e.keyCode) {
                case 33: //pagedown
                    this.pos -= this.canvas.height;
                    this.fixPos();
                    this.askForReDraw();
                    break;
                case 34: //pageup
                    this.pos += this.canvas.height;
                    this.fixPos();
                    this.askForReDraw();
                    break;
                case 38: //up
                    this.pos -= this.cellHeight * this.r;
                    this.fixPos();
                    this.askForReDraw();
                    break;
                case 40: //down
                    this.pos += this.cellHeight * this.r;
                    this.fixPos();
                    this.askForReDraw();
                    break;
            }
        };
        this.canvasTouchStart = (e) => {
            // console.log('start', e);
            this.touchStartY = e.changedTouches[0].pageY;
            e.preventDefault();
            this.run = false;
            this.lastmove.clear();
            this.lastmove.push({ x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, time: new Date() });
        };
        this.canvasTouchMove = (e) => {
            // console.log(e.changedTouches[0].pageY);
            this.run = false;
            this.lastmove.push({ x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, time: new Date() });
            let move = e.changedTouches[0].pageY - this.touchStartY;
            this.pos -= move;
            this.fixPos();
            this.touchStartY = e.changedTouches[0].pageY;
            this.askForReDraw();
            e.preventDefault();
        };
        this.canvasTouchEnd = (e) => {
            const list = this.lastmove.export();
            if (list.length > 2) {
                var i = list.length - 2;
                for (; i >= 0 && (list[list.length - 1].time.getTime() - list[i].time.getTime()) < 1000; i--) { }
                if (i < 0) {
                    i = 0;
                }
                var speed = (list[list.length - 1].y - list[i].y) / (list[list.length - 1].time.getTime() - list[i].time.getTime());
                if (Math.abs(speed) > 1) {
                    this.speed = speed * 10;
                    this.run = true;
                    this.runStart = (new Date()).getTime();
                    this.askForReDraw();
                }
            }
            e.preventDefault();
        };
        this.canvasScroll = (e) => {
            switch (e.deltaMode) {
                case 0: // DOM_DELTA_PIXEL	0x00	The delta values are specified in pixels.
                    this.pos += e.deltaY;
                    break;
                case 1: // DOM_DELTA_LINE	0x01	The delta values are specified in lines.
                    this.pos += e.deltaY * this.cellHeight * this.r;
                    break;
                case 2: // DOM_DELTA_PAGE	0x02	The delta values are specified in pages.
                    this.pos += e.deltaY * this.canvas.height * this.r;
                    break;
                default:
                    // uups
                    return;
            }
            this.fixPos();
            this.askForReDraw();
        };
        this.canvasMouseDown = (e) => {
            if (!this.hasScrollBar) {
                return;
            }
            const x = e.clientX - this.canvas.offsetLeft;
            const y = e.clientY - this.canvas.offsetTop;
            if (x < this.canvas.width / this.r - this.scrollbarSize) {
                return;
            }
            if (y < 20) {
                if (this.pos === 0) {
                    return;
                }
                this.pos -= this.cellHeight * this.r;
                if (this.pos < 0) {
                    this.pos = 0;
                }
                this.isOverScollThumb = false;
                this.askForReDraw();
                return;
            }
            if (y > this.canvas.height / this.r - 20) {
                if (this.pos === this.scrollBarPosMax) {
                    return;
                }
                this.pos += this.cellHeight * this.r;
                if (this.pos > this.scrollBarPosMax) {
                    this.pos = this.scrollBarPosMax;
                }
                this.isOverScollThumb = false;
                this.askForReDraw();
                return;
            }
            if (y > this.scrollBarThumbMax) {
                this.isOverScollThumb = false;
                this.pos += this.canvas.height / this.r - 20;
                this.fixPos();
                this.askForReDraw();
                return;
            }
            if (y < this.scrollBarThumbMin) {
                this.isOverScollThumb = false;
                this.pos -= this.canvas.height - 20 * this.r;
                this.fixPos();
                this.askForReDraw();
                return;
            }
            this.scrollBarThumbDown = true;
            this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
            this.canvas.removeEventListener("mouseup", this.canvasMouseUp);
            window.addEventListener("mousemove", this.canvasMouseMoveScrollBarDown);
            window.addEventListener("mouseup", this.canvasMouseUpScrollBarDown);
            if (!this.isOverScollThumb) {
                this.isOverScollThumb = true;
                this.drawScrollbar();
            }
        };
        this.canvasMouseLeave = () => {
            if (this.isOverScollThumb && !this.scrollBarThumbDown) {
                this.isOverScollThumb = false;
                this.drawScrollbar();
            }
        };
        this.canvasMouseUp = (e) => {
            if (!this.hasScrollBar) {
                return;
            }
            const x = e.clientX - this.canvas.offsetLeft;
            const y = e.clientY - this.canvas.offsetTop;
            this.scrollBarThumbDown = false;
        };
        this.canvasMouseUpScrollBarDown = (e) => {
            if (!this.hasScrollBar) {
                return;
            }
            const x = e.clientX - this.canvas.offsetLeft;
            const y = e.clientY - this.canvas.offsetTop;
            this.scrollBarThumbDown = false;
            if (this.isOverScollThumb) {
                this.isOverScollThumb = false;
                this.drawScrollbar();
            }
            window.removeEventListener("mousemove", this.canvasMouseMoveScrollBarDown);
            window.removeEventListener("mouseup", this.canvasMouseUpScrollBarDown);
            this.canvas.addEventListener("mousemove", this.canvasMouseMove);
            this.canvas.addEventListener("mouseup", this.canvasMouseUp);
        };
        this.canvasMouseMoveScrollBarDown = (e) => {
            const y = e.clientY - this.canvas.offsetTop;
            this.pos = this.scrollBarPosMax * ((y - 20) / (this.canvas.clientHeight - 20 * 2));
            this.fixPos();
            this.askForReDraw();
        };
        this.canvasMouseMove = (e) => {
            if (!this.hasScrollBar) {
                return;
            }
            const x = e.clientX - this.canvas.offsetLeft;
            const y = e.clientY - this.canvas.offsetTop;
            if (this.scrollBarThumbDown) {
                this.pos = this.scrollBarPosMax * ((y - 20) / (this.canvas.clientHeight - 20 * 2));
                this.fixPos();
                this.askForReDraw();
                return;
            }
            if (x < this.canvas.width / this.r - this.scrollbarSize) {
                if (this.isOverScollThumb) {
                    this.isOverScollThumb = false;
                    this.drawScrollbar();
                }
                return;
            }
            if (this.scrollBarThumbMin <= y && y <= this.scrollBarThumbMax) {
                if (!this.isOverScollThumb) {
                    this.isOverScollThumb = true;
                    this.drawScrollbar();
                }
                return;
            }
            if (this.isOverScollThumb) {
                this.isOverScollThumb = false;
                this.drawScrollbar();
                return;
            }
        };
        this.lastmove = new CircularBuffer_1.CircularBuffer(100, true);
        this.data = data;
        this.calcIndex();
        this.pos = 0;
        this.canvas = document.getElementById(htmlId);
        this.canvas.addEventListener("mousedown", this.canvasMouseDown);
        this.canvas.addEventListener("mousemove", this.canvasMouseMove);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp);
        this.canvas.addEventListener("mouseleave", this.canvasMouseLeave);
        this.canvas.addEventListener("wheel", this.canvasScroll);
        this.canvas.addEventListener("touchstart", this.canvasTouchStart);
        this.canvas.addEventListener("touchmove", this.canvasTouchMove);
        this.canvas.addEventListener("touchend", this.canvasTouchEnd);
        this.canvas.addEventListener("keydown", this.canvasKeydown);
        const context = this.canvas.getContext("2d");
        if (context === null) {
            throw "context is null";
        }
        this.context = context;
        this.UpdateColumns(col);
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
        this.calcIndex();
        this.askForReDraw();
    }
    SetSort(sortCol) {
        this.sortCol = sortCol;
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
        for (var i = 0; i < col.length; i++) {
            if (col[i].visible === false) {
                continue;
            }
            this.column[this.column.length] = Object.assign({
                align: Align.left,
                leftPos: 0,
                width: 50,
            }, col[i]);
        }
        this.resize();
    }
    calcIndex() {
        this.dataIndex = [];
        if (this.cusomFilter) {
            for (var i = 0; i < this.data.length; i++) {
                if (this.cusomFilter(this.data, this.data[i], this.orgColum)) {
                    this.dataIndex[this.dataIndex.length] = i;
                }
            }
        }
        else {
            for (var i = 0; i < this.data.length; i++) {
                this.dataIndex[this.dataIndex.length] = i;
            }
        }
        if (this.customSort) {
            const customSort = this.customSort;
            this.dataIndex.sort((a, b) => {
                return customSort(this.data, this.data[a], this.data[b]);
            });
        }
        else {
            const sortCol = this.sortCol;
            if (sortCol && sortCol.length) {
                this.dataIndex.sort((a, b) => {
                    for (var i = 0; i < sortCol.length; i++) {
                        var d, col = sortCol[i];
                        switch (col.col.field) {
                            case "__rownum__":
                                d = a - b;
                                if (d !== 0) {
                                    return d * col.sort;
                                }
                                break;
                            default:
                                var da = this.data[a][col.col.field], db = this.data[b][col.col.field];
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
    }
    fixPos() {
        if (!this.hasScrollBar) {
            this.pos = 0;
            return;
        }
        if (this.pos < 0) {
            this.pos = 0;
        }
        else {
            if (this.pos > this.scrollBarPosMax) {
                this.pos = this.scrollBarPosMax;
            }
        }
    }
    stop() {
        this.run = !this.run;
        if (this.run) {
            this.askForReDraw();
        }
    }
    resize() {
        this.r = window.devicePixelRatio;
        this.canvas.width = this.canvas.clientWidth * this.r;
        this.canvas.height = this.canvas.clientHeight * this.r;
        var leftPos = 0;
        for (var i = 0; i < this.column.length; i++) {
            this.column[i].leftPos = leftPos;
            leftPos += this.column[i].width * this.r;
        }
        this.askForReDraw();
    }
    askForReDraw() {
        if (this.requestAnimationFrame) {
            return;
        }
        this.requestAnimationFrame = window.requestAnimationFrame(() => this.drawCanvas());
    }
    drawCanvas() {
        this.requestAnimationFrame = undefined;
        // let speed = parseInt(this.inputSpeed.value);
        if (this.run) {
            const time = (new Date()).getTime() - this.runStart;
            if (time < 1500) {
                this.pos -= (this.speed * this.r) * (1 - time / 1500);
                this.fixPos();
                this.requestAnimationFrame = window.requestAnimationFrame(() => this.drawCanvas());
            }
            else {
                this.run = false;
            }
        }
        const offsetLeft = 5 * this.r;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.font = 14 * this.r + "px arial";
        this.context.fillStyle = 'black';
        this.context.strokeStyle = 'black';
        let pos;
        const height = this.cellHeight * this.r;
        let i = Math.floor(this.pos / (height));
        pos = (-this.pos + (i + 1) * height);
        pos += 14 * this.r;
        const maxPos = this.canvas.height + this.cellHeight + 5 * this.r;
        while (pos < maxPos) {
            if (i < this.dataIndex.length) {
                const indexId = this.dataIndex[i];
                for (var col = 0; col < this.column.length; col++) {
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
                        const left = colItem.leftPos + 1;
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
                    const textWidth = this.context.measureText(data).width;
                    const needClip = textWidth > (colItem.width * this.r - offsetLeft * 2);
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
                    if (needClip) {
                        this.context.save();
                        this.context.beginPath();
                        this.context.rect(colItem.leftPos + offsetLeft, pos - height, colItem.width * this.r - offsetLeft * 2, height);
                        this.context.clip();
                        this.context.fillText(data, x, pos);
                        this.context.restore();
                    }
                    else {
                        this.context.fillText(data, x, pos);
                    }
                }
            }
            this.context.beginPath();
            this.context.moveTo(0, pos + 4 * this.r);
            this.context.lineTo(this.canvas.width, pos + 4 * this.r);
            this.context.stroke();
            pos += height;
            i++;
        }
        this.context.beginPath();
        let leftPos = 0;
        // Headder
        pos = 14 * this.r;
        this.context.clearRect(0, 0, this.canvas.width, pos + 4 * this.r);
        for (var col = 0; col < this.column.length; col++) {
            leftPos += this.column[col].width * this.r;
            this.context.moveTo(leftPos, 0);
            this.context.lineTo(leftPos, this.canvas.height);
        }
        this.context.stroke();
        this.context.textAlign = 'left';
        for (var col = 0; col < this.column.length; col++) {
            this.context.fillText(this.column[col].header, this.column[col].leftPos + offsetLeft, pos);
        }
        this.context.beginPath();
        this.context.moveTo(0, pos + 4 * this.r);
        this.context.lineTo(this.canvas.width, pos + 4 * this.r);
        this.context.stroke();
        // console.log(performance.now() - now);
        this.drawScrollbar();
    }
    drawScrollbar() {
        const height = this.canvas.height - this.r * 16 * 2;
        const page = (this.dataIndex.length * 20 * this.r) / (this.canvas.height - 18 * this.r);
        if (page < 1) {
            this.hasScrollBar = false;
            return;
        }
        var delta = this.dataIndex.length * this.cellHeight * this.r - (this.canvas.height - 18 * this.r);
        const ratio = delta === 0 ? 1 : (this.pos / delta);
        this.hasScrollBar = true;
        let scrollBarSize = Math.max(10 * this.r, (height / page));
        let scrollBarPos = 16 * this.r + ratio * (height - scrollBarSize);
        this.scrollBarThumbMin = scrollBarPos / this.r;
        this.scrollBarThumbMax = (scrollBarPos + scrollBarSize) / this.r;
        this.scrollBarPosMax = delta;
        this.context.fillStyle = '#f0f0f0';
        this.context.fillRect(this.canvas.width - this.r * this.scrollbarSize, 0, this.r * this.scrollbarSize, this.canvas.height);
        this.context.fillStyle = '#b0b0b0';
        this.context.beginPath();
        this.context.moveTo(this.canvas.width - this.r * 10, this.r * 3);
        this.context.lineTo(this.canvas.width - this.r * 18, this.r * 13);
        this.context.lineTo(this.canvas.width - this.r * 2, this.r * 13);
        this.context.moveTo(this.canvas.width - this.r * 10, this.canvas.height - this.r * 3);
        this.context.lineTo(this.canvas.width - this.r * 18, this.canvas.height - this.r * 13);
        this.context.lineTo(this.canvas.width - this.r * 2, this.canvas.height - this.r * 13);
        this.context.fill();
        if (this.isOverScollThumb) {
            this.context.fillStyle = 'red';
        }
        this.context.beginPath();
        this.context.moveTo(this.canvas.width - this.r * this.scrollbarSize, scrollBarPos);
        this.context.lineTo(this.canvas.width, scrollBarPos);
        this.context.lineTo(this.canvas.width, scrollBarPos + scrollBarSize);
        this.context.lineTo(this.canvas.width - this.r * this.scrollbarSize, scrollBarPos + scrollBarSize);
        this.context.fill();
    }
}
exports.CanvasTable = CanvasTable;
//# sourceMappingURL=CanvasTable.js.map