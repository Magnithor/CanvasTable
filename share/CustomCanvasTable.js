"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTableColum_1 = require("./CanvasTableColum");
const CustomCanvasIndex_1 = require("./CustomCanvasIndex");
class CustomCanvasTable {
    constructor(config) {
        this.needToCalc = true;
        this.needToCalcFont = true;
        this.r = 1;
        this.data = [];
        this.minFontWidth = 1;
        this.maxFontWidth = 1;
        this.cellHeight = 20;
        this.dataIndex = undefined;
        this.column = [];
        this.orgColum = [];
        this.lastCursor = "";
        this.canvasHeight = 0;
        this.canvasWidth = 0;
        this.config = Object.assign({
            font: "arial",
            fontStyle: "",
            fontSize: 14,
            fontColor: "black",
            headerFont: "arial",
            headerFontStyle: "bold",
            headerFontSize: 14,
            headerFontColor: "black",
            headerBackgroundColor: "#0000EC",
            headerDrawSortArrowColor: "purple",
            headerDrawSortArrow: true,
            lineColor: "black",
            backgroundColor: "white",
            howerBackgroundColor: "#DCDCDC",
            sepraBackgroundColor: '#ECECEC'
        }, config);
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
                this.drawconf = Object.assign({}, config, { fulldraw: false });
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
        if (!col) {
            col = [];
        }
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
                align: CanvasTableColum_1.Align.left,
                leftPos: 0,
                rightPos: 0,
                width: 50,
                orginalCol: col[i]
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
            this.column[i].rightPos = leftPos;
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
    updateCursor(cursor = "") {
        if (this.lastCursor === cursor) {
            return;
        }
        this.lastCursor = cursor;
        this.setCursor(cursor);
    }
    expendedAll() {
        if (this.dataIndex === undefined) {
            return;
        }
        if (this.dataIndex.type === CustomCanvasIndex_1.ItemIndexType.GroupItems) {
            this.changeChildExpended(this.dataIndex, true);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }
    collapseAll() {
        if (this.dataIndex === undefined) {
            return;
        }
        if (this.dataIndex.type === CustomCanvasIndex_1.ItemIndexType.GroupItems) {
            this.changeChildExpended(this.dataIndex, false);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }
    resizeColIfNeed(x) {
        if (this.columnResize === undefined) {
            return false;
        }
        const d = x - this.columnResize.x;
        const col = this.columnResize.col;
        if (d === 0 || col.width + d < 10) {
            return true;
        }
        col.width += d;
        this.columnResize.x = x;
        col.orginalCol.width = col.width;
        this.calcColum();
        this.askForReDraw();
        return true;
    }
    clickOnHeader(col) {
        if (col) {
            if (this.sortCol && this.sortCol.length == 1 && this.sortCol[0].col == col && this.sortCol[0].sort == CanvasTableColum_1.Sort.ascending) {
                this.setSort([{ col: col, sort: CanvasTableColum_1.Sort.descending }]);
            }
            else {
                this.setSort([{ col: col, sort: CanvasTableColum_1.Sort.ascending }]);
            }
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
        if (y <= 18) {
            const colSplit = this.findColSplit(x);
            if (colSplit !== null) {
                this.columnResize = { x: x, col: this.column[colSplit] };
                this.askForExtentedMouseMoveAndMaouseUp();
                return;
            }
            const col = this.findColByPos(x);
            this.clickOnHeader(col);
            return;
        }
        if (this.dataIndex.type === CustomCanvasIndex_1.ItemIndexType.GroupItems) {
            const result = this.findRowByPos(y);
            if (result !== null && typeof result === "object") {
                result.isExpended = !result.isExpended;
                this.askForReDraw();
                this.reCalcForScrollView();
                return;
            }
        }
    }
    mouseMove(x, y) {
        if (!this.scrollView) {
            return;
        }
        if (this.resizeColIfNeed(x)) {
            return;
        }
        if (this.scrollView.onMouseMove(x, y)) {
            this.updateCursor();
            this.overRow = undefined;
            return;
        }
        if (y < 18) {
            this.overRow = undefined;
            if (this.findColSplit(x) === null) {
                this.updateCursor();
            }
            else {
                this.updateCursor("col-resize");
            }
            return;
        }
        else {
            this.updateCursor();
            const result = this.findRowByPos(y);
            if (typeof result === "number") {
                this.overRow = result;
                return;
            }
            this.overRow = undefined;
        }
    }
    mouseUp(x, y) {
        if (this.columnResize) {
            this.columnResize = undefined;
            this.askForNormalMouseMoveAndMaouseUp();
        }
        if (this.scrollView && this.scrollView.onMouseUp(x, y)) {
            return;
        }
    }
    mouseMoveExtended(x, y) {
        if (this.resizeColIfNeed(x)) {
            return;
        }
        if (this.scrollView && this.scrollView.onExtendedMouseMove(x, y)) {
            return;
        }
    }
    mouseUpExtended(x, y) {
        if (this.columnResize) {
            this.columnResize = undefined;
            this.askForNormalMouseMoveAndMaouseUp();
        }
        if (this.scrollView && this.scrollView.onExtendedMouseUp(x, y)) {
            return;
        }
    }
    mouseLeave() {
        this.overRow = undefined;
        if (this.columnResize === undefined) {
            this.updateCursor();
        }
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
        //if (this.dataIndex === undefined) { return; }
        //if (this.dataIndex.type === ItemIndexType.GroupItems) 
        {
            if (e.changedTouches.length === 1) {
                const y = e.changedTouches[0].pageY - offsetTop;
                const x = e.changedTouches[0].pageX - offsetLeft;
                this.touchClick = { timeout: setTimeout(() => {
                        if (y > 18) {
                            const result = this.findRowByPos(y);
                            if (result !== null && typeof result === "object") {
                                result.isExpended = !result.isExpended;
                                this.askForReDraw();
                                this.reCalcForScrollView();
                                return;
                            }
                        }
                        else {
                            const col = this.findColByPos(x);
                            this.clickOnHeader(col);
                        }
                    }, 250), x: x, y: y };
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
    findColSplit(x) {
        if (this.scrollView === undefined) {
            return null;
        }
        for (let i = 0; i < this.column.length; i++) {
            const d = ((-this.scrollView.posX + this.column[i].rightPos) / this.r) - x;
            if (-3 <= d && d <= 3) {
                return i;
            }
        }
        return null;
    }
    findColByPos(x) {
        if (this.scrollView === undefined) {
            return null;
        }
        let pos = this.scrollView.posX / this.r + x;
        let w = 0;
        for (var i = 0; i < this.column.length; i++) {
            w += this.column[i].width;
            if (w >= pos) {
                return this.column[i];
            }
        }
        return null;
    }
    findRowByPos(y) {
        if (this.dataIndex === undefined || this.scrollView === undefined) {
            return null;
        }
        let pos = -this.scrollView.posY / this.r + 18;
        const cellHeight = this.cellHeight;
        const maxHeight = this.canvasHeight / this.r;
        let find = function (items) {
            let i;
            if (items.type === CustomCanvasIndex_1.ItemIndexType.Index) {
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
            let groupItems = { type: CustomCanvasIndex_1.ItemIndexType.GroupItems, list: [] };
            this.group(groupItems, index, 0, groupByCol, this.dataIndex === undefined || this.dataIndex.type === CustomCanvasIndex_1.ItemIndexType.Index ? undefined : this.dataIndex);
            this.dataIndex = groupItems;
        }
        else {
            this.dataIndex = { type: CustomCanvasIndex_1.ItemIndexType.Index, list: index };
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
                if (item.child.type === CustomCanvasIndex_1.ItemIndexType.Index) {
                    item.child.list.push(id);
                }
            }
            else {
                r.set(c, g.list.length);
                const oldGroupItem = this.tryFind(old, c);
                g.list.push({ caption: c, isExpended: oldGroupItem === undefined ? false : oldGroupItem.isExpended, child: { type: CustomCanvasIndex_1.ItemIndexType.Index, list: [id] } });
            }
        }
        level++;
        if (groupByCol.length > level) {
            for (let i = 0; i < g.list.length; i++) {
                const child = g.list[i].child;
                if (child.type === CustomCanvasIndex_1.ItemIndexType.Index) {
                    let item = { type: CustomCanvasIndex_1.ItemIndexType.GroupItems, list: [] };
                    const oldGroupItem = this.tryFind(old, g.list[i].caption);
                    this.group(item, child.list, level, groupByCol, oldGroupItem === undefined || oldGroupItem.child.type === CustomCanvasIndex_1.ItemIndexType.Index ? undefined : oldGroupItem.child);
                    g.list[i].child = item;
                }
            }
        }
    }
    changeChildExpended(g, value) {
        for (let i = 0; i < g.list.length; i++) {
            g.list[i].isExpended = value;
            const child = g.list[i].child;
            if (child.type === CustomCanvasIndex_1.ItemIndexType.GroupItems) {
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
                case CustomCanvasIndex_1.ItemIndexType.Index:
                    h += cellHeight * index.list.length;
                    break;
                case CustomCanvasIndex_1.ItemIndexType.GroupItems:
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
        this.context.font = this.config.fontStyle + " " + this.config.fontSize * this.r + "px " + this.config.font;
        if (this.needToCalcFont) {
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
        this.context.fillStyle = this.config.fontColor;
        this.context.strokeStyle = this.config.lineColor;
        const colStart = 0;
        const colEnd = this.column.length;
        const height = this.cellHeight * this.r;
        let index = this.dataIndex;
        let pos, i, maxPos;
        switch (index.type) {
            case CustomCanvasIndex_1.ItemIndexType.Index:
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
                for (let col = colStart; col < colEnd; col++) {
                    const rightPos = -this.scrollView.posX + this.column[col].rightPos;
                    this.context.moveTo(rightPos, headderHeight);
                    this.context.lineTo(rightPos, this.canvasHeight);
                }
                this.context.stroke();
                break;
            case CustomCanvasIndex_1.ItemIndexType.GroupItems:
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
        this.context.font = this.config.headerFontStyle + " " + this.config.headerFontSize * this.r + "px " + this.config.headerFont;
        this.context.fillStyle = this.config.headerFontColor;
        this.context.clearRect(0, 0, this.canvasWidth, headderHeight);
        this.context.beginPath();
        for (let col = colStart; col < colEnd; col++) {
            const rightPos = -this.scrollView.posX + this.column[col].rightPos;
            this.context.moveTo(rightPos, 0);
            this.context.lineTo(rightPos, headderHeight);
        }
        this.context.stroke();
        this.context.textAlign = 'left';
        for (let col = colStart; col < colEnd; col++) {
            let needClip;
            const colItem = this.column[col];
            const colWidth = this.column[col].width * this.r - offsetLeft * 2;
            const data = this.column[col].header;
            if (colWidth > data.length * this.maxFontWidth) {
                needClip = false;
            }
            else if (colWidth < data.length * this.minFontWidth) {
                needClip = true;
            }
            else {
                needClip = colWidth < this.context.measureText(data).width;
            }
            this.context.fillStyle = this.config.headerBackgroundColor;
            if (needClip) {
                this.context.fillRect(-this.scrollView.posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1, colItem.width * this.r - 1 * 2, height - 3);
                this.context.save();
                this.context.beginPath();
                this.context.rect(-this.scrollView.posX + colItem.leftPos + offsetLeft, pos - height, colItem.width * this.r - offsetLeft * 2, height);
                this.context.clip();
                this.context.fillStyle = this.config.headerFontColor;
                this.context.fillText(data, -this.scrollView.posX + colItem.leftPos + offsetLeft, pos);
                this.context.restore();
            }
            else {
                this.context.fillRect(-this.scrollView.posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1, colItem.width * this.r - 1 * 2, height - 3);
                this.context.fillStyle = this.config.headerFontColor;
                this.context.fillText(data, -this.scrollView.posX + colItem.leftPos + offsetLeft, pos);
            }
            if (this.config.headerDrawSortArrow) {
                var sort = undefined;
                if (this.sortCol) {
                    for (let i = 0; i < this.sortCol.length; i++) {
                        if (this.sortCol[i].col === this.column[col]) {
                            sort = this.sortCol[i].sort;
                            break;
                        }
                    }
                }
                if (sort) {
                    this.context.fillStyle = this.config.headerDrawSortArrowColor;
                    const startX = -this.scrollView.posX + this.column[col].rightPos;
                    if (sort === CanvasTableColum_1.Sort.ascending) {
                        this.context.beginPath();
                        this.context.moveTo(startX - 12 * this.r, 5 * this.r);
                        this.context.lineTo(startX - 4 * this.r, 5 * this.r);
                        this.context.lineTo(startX - 8 * this.r, 14 * this.r);
                        this.context.fill();
                    }
                    else {
                        this.context.beginPath();
                        this.context.moveTo(startX - 8 * this.r, 5 * this.r);
                        this.context.lineTo(startX - 12 * this.r, 14 * this.r);
                        this.context.lineTo(startX - 4 * this.r, 14 * this.r);
                        this.context.fill();
                    }
                }
            }
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
            if (child.type === CustomCanvasIndex_1.ItemIndexType.Index) {
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
                        this.context.strokeStyle = this.config.lineColor;
                        this.context.beginPath();
                        this.context.moveTo(0, pos + 4 * this.r + 1 - height);
                        this.context.lineTo(this.column[this.column.length - 1].rightPos, pos + 4 * this.r + 1 - height);
                        this.context.stroke();
                    }
                    const startPos = pos;
                    for (; i < child.list.length && pos < maxPos; i++) {
                        const item = child.list[i];
                        if (pos > 0) {
                            this.drawRowItem(item, i, pos, height, offsetLeft, colStart, colEnd, drawConf);
                        }
                        pos += height;
                    }
                    for (var col = colStart; col < colEnd; col++) {
                        const colItem = this.column[col];
                        this.context.beginPath();
                        this.context.moveTo(-this.scrollView.posX + colItem.rightPos, startPos + 4 * this.r + 1 - height);
                        this.context.lineTo(-this.scrollView.posX + colItem.rightPos, pos + 4 * this.r + 1 - height);
                        this.context.stroke();
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
                try {
                   data = colItem.customData(this, data, this.data[indexId], this.data, indexId, colItem);
                } catch(e) {
                    console.log("CanvasTable customData", colItem.header, e);
                    data = "";
                }
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
                case CanvasTableColum_1.Align.left:
                default:
                    x = colItem.leftPos + offsetLeft;
                    if (this.context.textAlign !== 'left') {
                        this.context.textAlign = 'left';
                    }
                    break;
                case CanvasTableColum_1.Align.right:
                    x = colItem.rightPos - offsetLeft;
                    if (this.context.textAlign !== 'right') {
                        this.context.textAlign = 'right';
                    }
                    break;
                case CanvasTableColum_1.Align.center:
                    x = colItem.leftPos + colItem.width * this.r * 0.5 - offsetLeft;
                    if (this.context.textAlign !== 'center') {
                        this.context.textAlign = 'center';
                    }
                    break;
            }
            if (this.overRowValue === indexId) {
                this.context.fillStyle = this.config.howerBackgroundColor;
            }
            else {
                this.context.fillStyle = i % 2 === 0 ? this.config.sepraBackgroundColor : this.config.backgroundColor;
            }
            if (needClip) {
                this.context.fillRect(-this.scrollView.posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1, colItem.width * this.r - 1 * 2, height - 3);
                this.context.save();
                this.context.beginPath();
                this.context.rect(-this.scrollView.posX + colItem.leftPos + offsetLeft, pos - height, colItem.width * this.r - offsetLeft * 2, height);
                this.context.clip();
                this.context.fillStyle = this.config.fontColor;
                this.context.fillText(data, -this.scrollView.posX + x, pos);
                this.context.restore();
            }
            else {
                this.context.fillRect(-this.scrollView.posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1, colItem.width * this.r - 1 * 2, height - 3);
                this.context.fillStyle = this.config.fontColor;
                this.context.fillText(data, -this.scrollView.posX + x, pos);
            }
        }
        if (drawConf === undefined) {
            this.context.beginPath();
            this.context.moveTo(0, pos + 4 * this.r);
            this.context.lineTo(this.column[this.column.length - 1].rightPos, pos + 4 * this.r);
            this.context.stroke();
        }
    }
}
exports.CustomCanvasTable = CustomCanvasTable;
