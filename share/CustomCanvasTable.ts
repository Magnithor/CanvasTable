import { Drawable } from "./Drawable";
import { ScrollView, ScrollViewConfig } from "./ScrollView";
import { CanvasContext2D, CanvasColor } from "./CanvasContext2D";
import { CanvasTableTouchEvent } from "./CanvasTableTouchEvent";
import { Align, RenderValue, CustomData, CanvasTableColumnConf, CustomFilter, CustomSort, CanvasTableColumnSort } from "./CanvasTableColum";
import { IndexType, ItemIndexType, GroupItem, GroupItems, Index } from "./CustomCanvasIndex";
export interface DrawConfig {
    drawOnly?: number[]
}

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
export interface CanvasTableConfig {
    scrollView?: ScrollViewConfig,
    font?: string,
    fontStyle?: string,
    fontSize?: number,
    fontColor?: CanvasColor,
    headerFont?: string,
    headerFontStyle?: string,
    headerFontSize?: number,
    headerFontColor?: CanvasColor,
    lineColor?:  CanvasColor,
    howerBackgroundColor ?: CanvasColor,
    sepraBackgroundColor?: CanvasColor
}

interface CanvasTableConf {
    scrollView?: ScrollViewConfig,
    font: string
    fontStyle: string,
    fontSize: number,
    fontColor: CanvasColor,
    headerFont: string,
    headerFontStyle: string,
    headerFontSize: number,
    headerFontColor: CanvasColor,
    backgroundColor: CanvasColor,
    lineColor: CanvasColor,
    howerBackgroundColor:CanvasColor,
    sepraBackgroundColor: CanvasColor
}

interface CanvasTableColumn {
    header: string;
    field: string;
    width: number;
    align: Align;
    leftPos: number;
    renderer?: RenderValue;
    customData?: CustomData;
}

export abstract class CustomCanvasTable implements Drawable {
    private needToCalc: boolean = true;
    private needToCalcFont: boolean = true;
    protected context?: CanvasContext2D;
    protected requestAnimationFrame?: number;
    protected drawconf?: DrawConfig & { fulldraw: boolean };
    protected r: number = 1;
    protected data: any[] = [];

    private minFontWidth: number = 1;
    private maxFontWidth: number = 1;

    protected scrollView?: ScrollView;

    protected cellHeight = 20;
    protected dataIndex?: IndexType = undefined;
    private column: CanvasTableColumn[] = [];
    private orgColum: CanvasTableColumnConf[] = [];
    private cusomFilter?: CustomFilter;
    private customSort?: CustomSort;
    private sortCol?: CanvasTableColumnSort[];
    private groupByCol?:string[];
    private overRowValue?: number;
    private touchClick?: {timeout: number, x: number, y: number};

    private canvasHeight: number = 0;
    private canvasWidth: number = 0;
    protected config: CanvasTableConf;
    constructor (config: CanvasTableConfig | undefined) {
        this.config = {
             ...{
                font: "arial",
                fontStyle: "",
                fontSize: 14,
                fontColor: "black",
                headerFont: "arial",
                headerFontStyle: "bold",
                headerFontSize: 14,
                headerFontColor: "bold",            
                lineColor: "black",
                backgroundColor: "white",
                howerBackgroundColor: "#DCDCDC",
                sepraBackgroundColor: '#ECECEC'
            }, ...config };
    }

    public isPlanToRedraw(): boolean {
        if (!this.requestAnimationFrame) {
            return false;
        }
        
        return (this.drawconf !== undefined && this.drawconf.fulldraw);
    }

    public askForReDraw(config?: DrawConfig) {
        if (config === undefined || (this.drawconf !== undefined && this.drawconf.fulldraw)) {
            this.drawconf = { fulldraw: true };
        } else {
          if (this.drawconf === undefined) {
            this.drawconf = {...config, ...{fulldraw :false}};
          } else {
           // this.drawconf = ...this.drawconf, ...config;
          }
        }

        if (this.requestAnimationFrame) {
            return;
        }

        this.requestAnimationFrame = requestAnimationFrame(
            () => {
                this.drawCanvas()
            });
    }

    
    public setFilter(filter?: CustomFilter | null) {
        if (filter === null) {
            filter = undefined;
        }
        if (this.cusomFilter !== filter) {
            this.cusomFilter = filter;
            this.calcIndex();
            this.askForReDraw();
        }
    }
    public setCustomSort(customSort?: CustomSort | null) {
        if (customSort === null) { customSort = undefined; }
        this.customSort = customSort;
        this.sortCol = undefined;
        this.calcIndex();
        this.askForReDraw();
    }
    public setSort(sortCol?: CanvasTableColumnSort[]) {
        this.sortCol = sortCol;
        this.customSort = undefined;
        this.calcIndex();
        this.askForReDraw();
    }
    public setGroupBy(col?:string[]) {
        if (!col) { col = []; }
        this.groupByCol = col;
        this.calcIndex();
        this.askForReDraw();
    }
    public setData(data?:any[]) {
        if (data !== undefined) {
            this.data = data;
        }
        this.calcIndex();
        this.askForReDraw();
    }
    public setColumnVisible(col: number, visible: boolean) {
        if (col < 0 || col >= this.orgColum.length) {
            throw "out of range";
        }

        if (visible && this.orgColum[col].visible === true) { return; }
        if (!visible && !this.orgColum[col].visible) { return; }
        this.orgColum[col].visible = visible;
        this.UpdateColumns(this.orgColum);
    }
    public UpdateColumns(col: CanvasTableColumnConf[]) {
        this.orgColum = col;
        this.column = [];
        for (let i = 0; i < col.length; i++) {
            if (col[i].visible === false) { continue; }
            this.column[this.column.length] = {
                ...{
                    align: Align.left,
                    leftPos: 0,
                    width: 50,
                }, ...col[i]
            };
        }
        this.needToCalc = true;

        this.resize();
        this.calcColum();
    }
    private calcColum() {
        this.needToCalc = false;

        let leftPos = 0;
        for (let i = 0; i < this.column.length; i++) {
            this.column[i].leftPos = leftPos;
            leftPos += this.column[i].width * this.r;
        }

        this.reCalcForScrollView();
    }
    protected setR(r: number) {
        if (this.r === r) { return; }
        this.r = r;
        this.needToCalc = true;    
        this.needToCalcFont = true;
    }
    protected abstract resize(): void;

    public expendedAll() {
        if (this.dataIndex === undefined) { return; }
        if (this.dataIndex.type === ItemIndexType.GroupItems) {
            this.changeChildExpended(this.dataIndex, true);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }

    public collapseAll() {
        if (this.dataIndex === undefined) { return; }
        if (this.dataIndex.type === ItemIndexType.GroupItems) {
            this.changeChildExpended(this.dataIndex, false);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }

    protected wheel(deltaMode: number, deltaX:number, deltaY: number) {
        if (this.scrollView) {
            this.scrollView.onScroll(deltaMode, deltaX, deltaY); 
        }
    }

    protected mouseDown(x: number, y: number) {
        if (this.dataIndex === undefined) { return; }
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
    protected mouseMove(x: number, y: number) {
        if (this.scrollView && this.scrollView.onMouseMove(x, y)) {
            this.overRow = undefined;
            return;
        }

        if (y < 18) {
            this.overRow = undefined;
            return;
        } else {
            const result = this.findByPos(y);
            if (typeof result === "number") {
                this.overRow = result;
                return;
            } 
            this.overRow = undefined;
        }
    }
    protected mouseUp(x: number, y: number) {
        if (this.scrollView && this.scrollView.onMouseUp(x, y)) { return; }
    }
    protected mouseMoveExtended(x: number, y: number) {
        if (this.scrollView && this.scrollView.onExtendedMouseMove(x, y)) { return; }
    }
    protected mouseUpExtended(x: number, y: number) {
        if (this.scrollView && this.scrollView.onExtendedMouseUp(x, y)) { return; }
    }
    protected mouseLeave() {
        this.overRow = undefined;
        if (this.scrollView) {
            this.scrollView.onMouseLeave();
        }
    }

    protected keydown(keycode: number) {
        if (this.scrollView && this.scrollView.OnKeydown(keycode)) {
            this.overRow = undefined;            
        }
    }

    protected TouchStart(e:CanvasTableTouchEvent, offsetLeft:number, offsetTop:number) {
        if (this.scrollView && this.scrollView.OnTouchStart(e, offsetLeft, offsetTop)) {
            return;
        }

        if (this.dataIndex === undefined) { return; }

        if (this.dataIndex.type === ItemIndexType.GroupItems) {
            if (e.changedTouches.length === 1) {
                const y = e.changedTouches[0].pageY - offsetTop;
                if (y > 18) {
                    this.touchClick = {timeout: setTimeout(()=>{                        
                        const result = this.findByPos(y);
                        if (result !== null && typeof result === "object") {
                            result.isExpended = !result.isExpended;
                            this.askForReDraw();
                            this.reCalcForScrollView();
                            return;
                        }
                    }, 250), x: e.changedTouches[0].pageX - offsetLeft, y:y};
                } else {
                    this.clearTouchClick();
                }
            } else {
                this.clearTouchClick();
            }
        }
    }
    protected TouchMove(e:CanvasTableTouchEvent, offsetLeft:number, offsetTop:number) {
        if (this.scrollView) {
            this.scrollView.OnTouchMove(e, offsetLeft, offsetTop);
        }
        if (this.touchClick)
        {
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
    protected TouchEnd(e:CanvasTableTouchEvent, offsetLeft:number, offsetTop:number) {
        if (this.scrollView) {
            this.scrollView.OnTouchEnd(e);
        }
    }

    private clearTouchClick() {
        if (this.touchClick) {
            clearTimeout(this.touchClick.timeout);
            this.touchClick = undefined;
        }
    }

    protected findByPos(y: number): number | GroupItem | null {
        if (this.dataIndex === undefined || this.scrollView === undefined) { return null; }
        let pos = -this.scrollView.posY / this.r + 18;
        const cellHeight = this.cellHeight;
        const maxHeight = this.canvasHeight / this.r;

        let find = function(items: GroupItems | Index):number | GroupItem | null {
            let i;
            if (items.type === ItemIndexType.Index) {
                const h = items.list.length * cellHeight;
                if (y > pos + h) {
                    pos += h;
                } 
                else {
                    i = Math.trunc((-pos+y) / cellHeight);       
                    pos += i*cellHeight;
                    return i < items.list.length ? items.list[i] : null;
                }
            } else {
                for (i = 0; i < items.list.length; i++) {
                    if (pos < y && y < pos+cellHeight) {
                        return items.list[i];
                    }
                    pos += cellHeight;
                    if (!items.list[i].isExpended) { continue; }
                    let f = find(items.list[i].child);
                    if (f !== null) {
                        return f;
                    }
                }
            }
            return null;
        }
        
        return find(this.dataIndex);
    }

    protected set overRow(value: number | undefined){
        if (value != this.overRowValue){
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

    protected calcIndex() {
        if (this.data === undefined) {
            return;
        }
        let index: number[] = []
        if (this.cusomFilter) {
            for (let i = 0; i < this.data.length; i++) {
                if (this.cusomFilter(this.data, this.data[i], this.orgColum)) {
                    index[index.length] = i;
                }
            }
        } else {
            for (let i = 0; i < this.data.length; i++) {
                index[index.length] = i;
            }
        }

        if (this.customSort) {
            const customSort = this.customSort;
            index.sort((a: number , b: number) => {
                return customSort(this.data, this.data[a], this.data[b]);
            });
        } else {
            const sortCol = this.sortCol;
            if (sortCol && sortCol.length) {
                index.sort((a: number, b: number) => {
                    for (let i = 0; i < sortCol.length; i++) {
                        let d, col = sortCol[i];
                        switch (col.col.field) {
                            case "__rownum__":
                                d = a - b;
                                if (d !== 0) { return d * col.sort; }
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
                                    if (d !== 0) { return d * col.sort; }
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
                })
            }
        }

        if (this.groupByCol && this.groupByCol.length > 0) {
            const groupByCol = this.groupByCol;
            let groupItems: GroupItems = {type:ItemIndexType.GroupItems, list:[]};
                        
            this.group(groupItems, index, 0, groupByCol, this.dataIndex === undefined || this.dataIndex.type === ItemIndexType.Index ? undefined : this.dataIndex );

            this.dataIndex = groupItems;
        } else {
            this.dataIndex =  { type: ItemIndexType.Index, list: index };
        }
        this.reCalcForScrollView();
    }
    private tryFind(idx: GroupItems | undefined, c: string): GroupItem | undefined {
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
    private group(g: GroupItems, index: number[], level: number, groupByCol: string[], old: GroupItems | undefined) {
        let r = new Map<string, number>();
        let p = new Map<GroupItem, number[]>();

        for (let i=0; i < index.length; i++) {
            const id = index[i];
            let c = String(this.data[id][groupByCol[level]]);
            let d = r.get(c);
            if (d !== undefined) {
                const item = g.list[d];
                if (item.child.type === ItemIndexType.Index) {
                    item.child.list.push(id);
                }
            } else {
                r.set(c, g.list.length);
                const oldGroupItem = this.tryFind(old, c);
                g.list.push({caption: c, isExpended: oldGroupItem === undefined ? false : oldGroupItem.isExpended, child: { type:ItemIndexType.Index, list: [id] }});
            }    
        }
        level++;
        if (groupByCol.length > level) {
            for (let i=0;i<g.list.length;i++) {
                const child = g.list[i].child;
                if (child.type === ItemIndexType.Index) {
                    let item: GroupItems = {  type: ItemIndexType.GroupItems, list: []};
                    const oldGroupItem = this.tryFind(old, g.list[i].caption);
                    this.group(item, child.list, level, groupByCol, oldGroupItem === undefined || oldGroupItem.child.type === ItemIndexType.Index?undefined:oldGroupItem.child);
                    g.list[i].child = item;
                }
            }
        }
    }

    private changeChildExpended(g: GroupItems, value: boolean) {
        for (let i=0; i < g.list.length; i++) {
            g.list[i].isExpended = value;
            const child = g.list[i].child;
            if (child.type === ItemIndexType.GroupItems) {
                this.changeChildExpended(child, value);
            }
        }
    }
    protected reCalcForScrollView() {
        if (this.dataIndex === undefined) {return;}
        let w:number | undefined = 1;
        if (this.column) {
            for (let i =0; i < this.column.length; i++) {
                w += this.column[i].width * this.r + 2;
            }        
        } else {
            w = undefined;
        }
        
        let h = 0;
        const cellHeight = this.cellHeight;
        let calc = function( index: Index | GroupItems ) {
            switch(index.type) {
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
        }

        calc(this.dataIndex);
        if (this.scrollView) {
            this.scrollView.setSize(this.r, this.canvasWidth, this.canvasHeight, w, h * this.r);
        }
    }
    protected setCanvasSize(width:number, height:number):void
    {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.reCalcForScrollView();
    }
    protected doReize(width:number, height:number) {
        this.setCanvasSize(width * this.r, height * this.r);
    }

    protected drawCanvas() {
        if (!this.scrollView || !this.context || !this.dataIndex) {
            return;
        }

        if (this.needToCalc){
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
        const colStart  = 0;
        const colEnd  = this.column.length;

        const height = this.cellHeight * this.r;
        let index = this.dataIndex;
        let pos: number, i, maxPos;
        switch(index.type) {
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
                let leftPos =  -this.scrollView.posX ;
                for (let col = colStart; col < colEnd; col++) {
                    leftPos += this.column[col].width * this.r;
                    this.context.moveTo(leftPos, headderHeight)
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
        this.context.font = this.config.headerFontStyle + " " + this.config.headerFontSize * this.r + "px " + this.config.headerFont;
        this.context.fillStyle = this.config.headerFontColor;
        this.context.clearRect(0, 0, this.canvasWidth, headderHeight);
        this.context.beginPath();
        let leftPos = 0;
        for (let col = colStart; col < colEnd; col++) {
            leftPos += this.column[col].width * this.r;

            this.context.moveTo(-this.scrollView.posX + leftPos, 0)
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

    private drawGroupItem(level:number, groupItem: GroupItem, pos: number, height: number, maxPos: number, offsetLeft: number, colStart: number, colEnd: number, drawConf: DrawConfig|undefined) {
        if (!this.scrollView || !this.context) {
            return 0;
        }
        if (pos > 0 && drawConf === undefined) {
            this.context.textAlign = 'left';
            this.context.fillText(groupItem.caption + ' (' + groupItem.child.list.length + ')',  -this.scrollView.posX + 10 * level * this.r, pos);
        }
        pos += height;
        if (groupItem.isExpended) {
            const child = groupItem.child;
            let i;
            if (child.type === ItemIndexType.Index) {
                if (0 > pos + child.list.length * height) {
                    pos += child.list.length * height;
                } else {
                    i = 0;
                    if (pos < -height) {
                        i = Math.trunc(-pos / height);
                        pos += i * height;
                    }
                    if (drawConf === undefined) {
                        this.context.strokeStyle = this.config.lineColor;
                        this.context.beginPath();            
                        this.context.moveTo(0, pos+ 4*this.r+1 -height);
                        this.context.lineTo(this.column[this.column.length-1].leftPos + this.column[this.column.length-1].width*this.r, pos+ 4*this.r+1-height);
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
            } else {
                for (i = 0; i < child.list.length && pos < maxPos; i++) {
                    const item = child.list[i];
                    pos = this.drawGroupItem(level + 1, item, pos, height, maxPos, offsetLeft, colStart, colEnd, drawConf);
                }
            }
        }
        return pos;

    }
    private drawRowItem(indexId: number, i: number, pos: number, height: number, offsetLeft: number, colStart:number, colEnd:number, drawConf: DrawConfig|undefined) {
        if (!this.scrollView || !this.context) { return 0; }
        if (drawConf !== undefined && drawConf.drawOnly !== undefined){
            let found = false;
            for (let i=0;i <drawConf.drawOnly.length; i++){
                if (drawConf.drawOnly[i] === indexId) {
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                return;
            } else {
                this.context.clearRect(0, pos - height + 4*this.r+1, this.canvasWidth, height-2);
            }
        }
        for (let col = colStart; col < colEnd; col++) {
            const colItem = this.column[col];
            let data: string;
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
                const left =  -this.scrollView.posX + colItem.leftPos + 1;
                const top = pos - height + 4 * this.r + 1;
                const width = colItem.width * this.r - 2;
                const h = height - 2;
                this.context.save();
                this.context.beginPath();
                this.context.rect(left, top, width, h);
                this.context.clip();
                try {
                    colItem.renderer(this, this.context, indexId, this.orgColum[col],
                        left, top, left + width, top + h, width, h, this.r,
                        data, this.data[indexId], this.data);
                } catch (e) {
                    console.log("CanvasTable renderer", colItem.header, e);
                }
                this.context.restore();
                continue;
            }
            
            let needClip: boolean;
            const colWidth = colItem.width * this.r - offsetLeft * 2;
            if (data === null) {
                return;
            }
            if (colWidth > data.length*this.maxFontWidth) {
                needClip = false;
            } else if (colWidth < data.length*this.minFontWidth) {
                needClip = true;
            } else {
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
                this.context.fillStyle = this.config.howerBackgroundColor;
            } else {
                this.context.fillStyle = i % 2 === 0 ?  this.config.sepraBackgroundColor : this.config.backgroundColor ;
            }

            if (needClip) {
                this.context.fillRect( -this.scrollView.posX + colItem.leftPos + 1, pos - height+4*this.r+1, colItem.width * this.r - 1 * 2, height-3);
                this.context.save();
                this.context.beginPath();
                this.context.rect( -this.scrollView.posX + colItem.leftPos + offsetLeft, pos - height, colItem.width * this.r - offsetLeft * 2, height);
                this.context.clip();
                this.context.fillStyle = this.config.fontColor;
                this.context.fillText(data,  -this.scrollView.posX + x, pos);
                this.context.restore();
            } else {
                this.context.fillRect( -this.scrollView.posX + colItem.leftPos + 1, pos - height+4*this.r+1, colItem.width * this.r - 1 * 2, height-3);
                this.context.fillStyle = this.config.fontColor;
                this.context.fillText(data,  -this.scrollView.posX + x, pos);
            }

            // Ætti að gerast fyrri ofan og lengri línur
            this.context.beginPath();            
            this.context.moveTo( -this.scrollView.posX + colItem.leftPos + colItem.width*this.r, pos - height + 4*this.r);
            this.context.lineTo( -this.scrollView.posX + colItem.leftPos + colItem.width*this.r, pos+ 4*this.r);
            this.context.stroke();
        }
        if (drawConf === undefined) {
            this.context.beginPath();            
            this.context.moveTo(0, pos + 4 * this.r);
            this.context.lineTo(this.column[this.column.length-1].leftPos + this.column[this.column.length-1].width*this.r, pos+ 4*this.r);
            this.context.stroke();
        }
    }
}