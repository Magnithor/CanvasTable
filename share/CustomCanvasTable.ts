import { CanvasColor, ICanvasContext2D } from "./CanvasContext2D";
import { Align, CustomFilter, CustomRowColStyle, CustomSort,
         ICanvasTableColumn, ICanvasTableColumnConf, ICanvasTableColumnSort,
         ICanvasTableRowColStyle, IUpdateRect, Sort } from "./CanvasTableColum";
import { CanvasTableMode } from "./CanvasTableMode";
import { ICanvasTableTouchEvent } from "./CanvasTableTouchEvent";
import { CanvasTableIndex, CanvasTableIndexs, CanvasTableIndexType, CanvasTableRowItem,
         CanvasTableRowItemSelect, ICanvasTableGroupItemColMode, ICanvasTableGroupItemRowMode,
         ICanvasTableGroupItemRowsRowMode, ICanvasTableGroupItemsColMode, ICanvasTableGroupItemsRowMode,
         ICanvasTableIndexsColMode, ICanvasTableIndexsRowMode, ICanvasTableRowItemSelectColMode } from "./CustomCanvasIndex";
import { IDrawable } from "./Drawable";
import { EventManagerClick, EventManagerClickHeader, EventManagerReCalcForScrollView } from "./EventManager";
import { IScrollViewConfig, ScrollView } from "./ScrollView";

export interface IDrawConfig {
    drawOnly?: number[];
}

type FrameRequestCallback = (time: number) => void;
declare function requestAnimationFrame(callback: FrameRequestCallback): number;
declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
export interface ICanvasTableGroup {
    field: string;
    aggregate?: (data: ICanvasTableGroupItemRowMode | ICanvasTableGroupItemRowMode |
                       ICanvasTableGroupItemColMode) => string;
    renderer?: (data: ICanvasTableGroupItemRowMode | ICanvasTableGroupItemColMode,
                canvasTable: CustomCanvasTable, context: ICanvasContext2D,
                left: number, top: number, right: number, bottom: number,
                width: number, height: number, r: number) => void;
}
export interface ICanvasRowTableGroup {
    field: string;
    aggregate?: (data: ICanvasTableIndexsRowMode) => string;
    renderer?: (data: ICanvasTableIndexsRowMode,
                canvasTable: CustomCanvasTable, context: ICanvasContext2D,
                left: number, top: number, right: number, bottom: number,
                width: number, height: number, r: number) => void;
}

/**
 * Interface to config style of CanvasTable
 */
export interface ICanvasTableConfig {
    /**
     * ScollView config
     */
    scrollView?: IScrollViewConfig;
    /**
     * FontName
     */
    font?: string;
    /**
     * Font Style
     */
    fontStyle?: string;
    /**
     * Font size in px
     */
    fontSize?: number;
    /**
     * Font color
     */
    fontColor?: CanvasColor;
    /**
     * Header font name
     */
    headerFont?: string;
    /**
     * Header font style
     */
    headerFontStyle?: string;
    /**
     * Header font size in px
     */
    headerFontSize?: number;
    /**
     * Header front color
     */
    headerFontColor?: CanvasColor;
    /**
     * Header Draw sort arrow
     */
    headerDrawSortArrow?: boolean;
    /**
     * Header draw sort arrow color
     */
    headerDrawSortArrowColor?: CanvasColor;
    /**
     * Header: background color in header
     */
    headerBackgroundColor?: CanvasColor;
    /**
     * Group item: font color
     */
    groupItemFontColor?: CanvasColor;
    /**
     * Group item: arrow color
     */
    groupItemArrowColor?: CanvasColor;
    /**
     * Group item: background color in group
     */
    groupItemBackgroundColor?: CanvasColor;
    /**
     * Row group item: font color
     */
    rowGroupItemFontColor?: CanvasColor;
    /**
     * Row group item: arrow color
     */
    rowGroupItemArrowColor?: CanvasColor;
    /**
     * Row group item: background color in group
     */
    rowGroupItemBackgroundColor?: CanvasColor;
    /**
     * Background color
     */
    backgroundColor?: CanvasColor;
    /**
     * color line in grid in CanvasTable
     */
    lineColor?: CanvasColor;
    /**
     * select line color in grid in CanvasTable
     */
    selectLineColor: CanvasColor;
    /**
     * Backgroud color when mouse is hover the row
     */
    howerBackgroundColor?: CanvasColor;
    /**
     * Every secound row can have another backgound color sepra
     */
    sepraBackgroundColor?: CanvasColor;
}

interface ICanvasTableConf {
    scrollView?: IScrollViewConfig;
    font: string;
    fontStyle: string;
    fontSize: number;
    fontColor: CanvasColor;
    headerFont: string;
    headerFontStyle: string;
    headerFontSize: number;
    headerFontColor: CanvasColor;
    headerDrawSortArrow: boolean;
    headerDrawSortArrowColor: CanvasColor;
    headerBackgroundColor: CanvasColor;
    groupItemFontColor: CanvasColor;
    groupItemArrowColor: CanvasColor;
    groupItemBackgroundColor: CanvasColor;
    rowGroupItemFontColor: CanvasColor;
    rowGroupItemArrowColor: CanvasColor;
    rowGroupItemBackgroundColor: CanvasColor;
    backgroundColor: CanvasColor;
    lineColor: CanvasColor;
    selectLineColor: CanvasColor;
    howerBackgroundColor: CanvasColor;
    sepraBackgroundColor: CanvasColor;
}

interface IColAndRowInRowMode<T>  {
    row: ICanvasTableGroupItemRowMode | ICanvasTableIndexsRowMode;
    col: ICanvasTableColumn<T> | null;
}

const defaultConfig: ICanvasTableConf = {
    backgroundColor: "white",
    font: "arial",
    fontColor: "black",
    fontSize: 14,
    fontStyle: "",
    groupItemArrowColor: "black",
    groupItemBackgroundColor: "#F9D3CB",
    groupItemFontColor: "back",
    headerBackgroundColor: "#add8e6",
    headerDrawSortArrow: true,
    headerDrawSortArrowColor: "purple",
    headerFont: "arial",
    headerFontColor: "black",
    headerFontSize: 14,
    headerFontStyle: "bold",
    howerBackgroundColor: "#DCDCDC",
    lineColor: "black",
    rowGroupItemArrowColor: "black",
    rowGroupItemBackgroundColor: "#F9D3CB",
    rowGroupItemFontColor: "black",
    selectLineColor: "green",
    sepraBackgroundColor: "#ECECEC",
};

export abstract class CustomCanvasTable<T = any> implements IDrawable {
    protected context?: ICanvasContext2D;
    protected requestAnimationFrame?: number;
    protected drawconf?: IDrawConfig & { fulldraw: boolean };
    protected r: number = 1;
    protected data: T[] = [];
    protected allowEdit: boolean = false;

    protected scrollView?: ScrollView;

    protected headerHeight = 18;
    protected cellHeight = 20;
    protected dataIndex?: CanvasTableIndex = undefined;
    protected config: ICanvasTableConf = defaultConfig;
    protected column: Array<ICanvasTableColumn<T>> = [];
    private eventDblClick: Array<EventManagerClick<T>> = [];
    private eventClick: Array<EventManagerClick<T>> = [];
    private eventClickHeader: Array<EventManagerClickHeader<T>> = [];
    private eventReCalcForScrollView: EventManagerReCalcForScrollView[] = [];

    private needToCalc: boolean = true;
    private needToCalcFont: boolean = true;

    private isFocus: boolean = false;
    private minFontWidth: number = 1;
    private maxFontWidth: number = 1;
    private orgColum: Array<ICanvasTableColumnConf<T>> = [];
    private customRowColStyle?: CustomRowColStyle<T>;
    private customFilter?: CustomFilter<T>;
    private customSort?: CustomSort<T>;
    private sortCol?: Array<ICanvasTableColumnSort<T>>;
    private groupByCol?: ICanvasTableGroup[];
    private rowTableGroup?: ICanvasRowTableGroup;
    private overRowValue?: number;
    private selectRowValue: CanvasTableRowItemSelect = null;
    private selectColValue?: ICanvasTableColumn<T>;
    private columnResize?: {x: number, col: ICanvasTableColumn<T>};
    private touchClick?: {timeout: number, x: number, y: number};

    private lastCursor: string = "";
    private canvasHeight: number = 0;
    private canvasWidth: number = 0;
    private editData: { [index: number]: { [field: string]: any } } = {};
    private tableMode: CanvasTableMode = CanvasTableMode.ColMode;

    constructor(config: ICanvasTableConfig | undefined) {
        this.updateConfig(config);
    }

    public getScrollView(): ScrollView | undefined {
        return this.scrollView;
    }

    /**
     * To customize style of CanvasTable
     * @param config config
     */
    public updateConfig(config: ICanvasTableConfig | undefined) {
        this.config = {
            ...defaultConfig, ...config };
    }

    /**
     * Is CanvasTable goging to redraw in next frame
     */
    public isPlanToRedraw(): boolean {
        if (!this.requestAnimationFrame) {
            return false;
        }

        return (this.drawconf !== undefined && this.drawconf.fulldraw);
    }

    /**
     * Let CanvasTable redraw
     * @param config
     */
    public askForReDraw(config?: IDrawConfig) {
        if (config === undefined || (this.drawconf !== undefined && this.drawconf.fulldraw)) {
            this.drawconf = { fulldraw: true };
        } else {
          if (this.drawconf === undefined) {
            this.drawconf = {...config, ...{fulldraw : false}};
          } else {
           // this.drawconf = ...this.drawconf, ...config;
          }
        }

        if (this.requestAnimationFrame) {
            return;
        }

        this.requestAnimationFrame = requestAnimationFrame(
            () => {
                this.drawCanvas();
            });
    }
    /**
     * Recalc index and then redraw
     * You need to call this if size of the data was change or columns witch was change is in active groupby or sort
     */
    public askForReIndex() {
        this.calcIndex();
        this.askForReDraw();
    }

    public setAllowEdit(allowEdit: boolean) {
        this.allowEdit = allowEdit;
    }

    public setRowColStyle(style?: CustomRowColStyle<T> | null) {
        if (style === null) {
            style = undefined;
        }
        if (this.customRowColStyle !== style) {
            this.customRowColStyle = style;
            this.askForReDraw();
        }
    }

    public setFilter(filter?: CustomFilter<T> | null) {
        if (filter === null) {
            filter = undefined;
        }

        if (this.customFilter !== filter) {
            this.customFilter = filter;
            this.askForReIndex();
        }
    }

    public setCustomSort(customSort?: CustomSort<T> | null) {
        if (customSort === null) { customSort = undefined; }
        this.customSort = customSort;
        this.sortCol = undefined;
        this.askForReIndex();
    }

    public setSort(sortCol?: Array<ICanvasTableColumnSort<T>>) {
        this.sortCol = sortCol;
        this.customSort = undefined;
        this.askForReIndex();
    }

    /**
     * Set group by data
     * @param col
     */
    public setGroupBy(col?: Array<string | ICanvasTableGroup>) {
        if (!col) { col = []; }
        const list: ICanvasTableGroup[] = [];
        let i;
        for (i = 0; i < col.length; i++) {
            const item = col[i];
            if (typeof item === "string") {
                list.push({field: item});
            } else {
                list.push(item);
            }
        }

        this.groupByCol = list;
        this.askForReIndex();
    }
    public setRowTableGroup(row?: string | ICanvasRowTableGroup) {
        if (typeof row === "string") {
            this.rowTableGroup = {field: row};
        } else {
            this.rowTableGroup = row;
        }

        this.askForReIndex();
    }
    public setTableMode(tableMode: CanvasTableMode) {
        if (tableMode !== this.tableMode) {
            this.tableMode = tableMode;
            this.askForReIndex();
        }
    }
    public getTableMode(): CanvasTableMode {
        return this.tableMode;
    }

    /**
     * Set new Data and then reindex and redraw
     * @param data new Data
     */
    public setData(data?: T[]) {
        if (data !== undefined) {
            this.data = data;
        }
        this.askForReIndex();
    }

    /**
     * Change the visibility of the column
     * @param col index of colum or the column it self
     * @param visible show or hide the colum
     */
    public setColumnVisible(col: number | ICanvasTableColumnConf<T>, visible: boolean): void {
        if (typeof col === "number") {
            if (col < 0 || col >= this.orgColum.length) {
                throw new Error("out of range");
            }

            if (visible && this.orgColum[col].visible === true) { return; }
            if (!visible && !this.orgColum[col].visible) { return; }
            this.orgColum[col].visible = visible;
            this.updateColumns(this.orgColum);
            return;
        }
        const v = col.visible === undefined ? true : false;

        if (v !== visible) {
            col.visible = v;
            this.updateColumns(this.orgColum);
            return;
        }
    }
    public updateColumns(col: Array<ICanvasTableColumnConf<T>>) {
        this.orgColum = col;
        this.column = [];
        let i;
        for (i = 0; i < col.length; i++) {
            if (col[i].visible === false) { continue; }
            const index = this.column.length;
            this.column[index] = {
                ...{
                    align: Align.left,
                    allowEdit: true,
                    index,
                    leftPos: 0,
                    orginalCol: col[i],
                    rightPos: 0,
                    width: 50,
                }, ...col[i],
            };

            if (this.column[index].field === "__idxnum__" || this.column[index].field === "__rownum__") {
                this.column[index].allowEdit = false;
            }
        }
        this.needToCalc = true;

        this.resize();
        this.calcColum();
    }

    /**
     * Expend All data in tree mode
     */
    public expendAll() {
        const dataIndex = this.dataIndex;
        if (dataIndex === undefined) {
            return;
        }

        if (dataIndex.mode === CanvasTableMode.ColMode) {
            const index = dataIndex.index;
            if (index.type === CanvasTableIndexType.GroupItems) {
                this.changeChildExpend(index, true);
                this.reCalcForScrollView();
                this.askForReDraw();
                return;
            }
        } else {
            this.changeChildExpend(dataIndex.index, true);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }

    /**
     * Collapse All data in tree mode
     */
    public collapseAll() {
        const dataIndex = this.dataIndex;
        if (dataIndex === undefined) {
            return;
        }

        if (dataIndex.mode === CanvasTableMode.ColMode) {
            const index = dataIndex.index;
            if (index.type === CanvasTableIndexType.GroupItems) {
                this.changeChildExpend(index, false);
                this.reCalcForScrollView();
                this.askForReDraw();
                return;
            }
        } else {
            this.changeChildExpend(dataIndex.index, false);
            this.reCalcForScrollView();
            this.askForReDraw();
        }
    }

    public addEvent(eventName: "clickHeader", event: EventManagerClickHeader<T>): void;
    public addEvent(eventName: "click" | "dblClick", event: EventManagerClick<T>): void;
    public addEvent(eventName: "reCalcForScrollView", event: EventManagerReCalcForScrollView): void;
    public addEvent(eventName: string, event: any): void {
        this.getEvent(eventName).push(event);
    }

    public removeEvent(eventName: "clickHeader", event: EventManagerClickHeader<T>): void;
    public removeEvent(eventName: "click" | "dblClick", event: EventManagerClick<T>): void;
    public removeEvent(eventName: "reCalcForScrollView", event: EventManagerReCalcForScrollView): void;
    public removeEvent(eventName: string, event: any): void {
        const e = this.getEvent(eventName);
        const index = e.indexOf(event);
        if (index !== -1) {
            e.splice(index, 1);
        }
    }
    public setUpdateData(row: number, field: string, data: any) {
        if (!this.editData[row]) {
            this.editData[row] = {};
        }

        this.editData[row][field] = data;
    }
    public getUpdateData(row: number, field: string): {data: any} | undefined {
        const rowData = this.editData[row];
        if (!rowData) { return undefined; }
        if (rowData.hasOwnProperty(field)) {
            return { data: rowData[field] };
        }
        return undefined;
    }
    public getUpdateDataOrData(row: number, field: string): any {
        const rowData = this.editData[row];
        if (rowData && rowData.hasOwnProperty(field)) {
            return rowData[field];
        }

        return (this.data[row] as any)[field];
    }
    public getEditData() {
        return this.editData;
    }
    public clearEditData() {
        this.editData = {};
        this.askForReIndex();
    }
    public abstract resize(): void;
    protected logError(value: string, value2?: any, value3?: any): void {
        // tslint:disable-next-line: no-console
        console.log(value, value2, value3);
    }
    protected setOverRow(value: number | undefined) {
        if (value !== this.overRowValue) {
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

    protected setR(r: number) {
        if (this.r === r) { return; }
        this.r = r;
        this.needToCalc = true;
        this.needToCalcFont = true;
    }
    protected abstract setCursor(cusor: string): void;
    protected abstract askForExtentedMouseMoveAndMaouseUp(): void;
    protected abstract askForNormalMouseMoveAndMaouseUp(): void;
    protected abstract scrollViewChange(): void;
    protected getColumnByCanvasTableColumnConf(column: ICanvasTableColumnConf<T>): ICanvasTableColumn<T> | undefined {
        let i;
        for (i = 0; i < this.column.length; i++) {
            if (this.column[i].orginalCol === column) {
                return this.column[i];
            }
        }

        return undefined;
    }
    protected setIsFocus(isFocus: boolean) {
        if (this.isFocus !== isFocus) {
            this.isFocus = isFocus;
            if (this.allowEdit) {
                this.askForReDraw();
            }
        }
    }
    protected fireDblClick(row: CanvasTableRowItem, col: ICanvasTableColumn<T> | null) {
        let i;
        for (i = 0; i < this.eventDblClick.length; i++) {
            try {
                this.eventDblClick[i](this, row, col === null ? null : col.orginalCol);
            } catch {
                this.logError("fireDblClick");
            }
        }
    }
    protected fireClick(row: CanvasTableRowItem, col: ICanvasTableColumn<T> | null) {
        let i;
        for (i = 0; i < this.eventClick.length; i++) {
            try {
                this.eventClick[i](this, row, col === null ? null : col.orginalCol);
            } catch {
                this.logError("fireClick");
            }
        }
    }
    protected fireClickHeader(col: ICanvasTableColumn<T> | null) {
        let i;
        for (i = 0; i < this.eventClick.length; i++) {
            try {
                this.eventClickHeader[i](this, col === null ? null : col.orginalCol);
            } catch {
                this.logError("fireClickHeader");
            }
        }
    }
    protected fireReCalcForScrollView(width: number, height: number) {
        const scrollView = this.scrollView;
        if (scrollView) {
            let i ;
            for (i = 0; i < this.eventReCalcForScrollView.length; i++) {
                try {
                    this.eventReCalcForScrollView[i](this, width, height, scrollView);
                } catch {
                    this.logError("fireReCalcForScrollView");
                }
            }
        }
    }

    protected clickOnHeader(col: ICanvasTableColumn<T> | null) {
        if (col) {
            if (this.sortCol && this.sortCol.length === 1 &&
                this.sortCol[0].col === col.orginalCol && this.sortCol[0].sort === Sort.ascending) {
                this.setSort([{col: col.orginalCol, sort: Sort.descending}]);
            } else {
                this.setSort([{col: col.orginalCol, sort: Sort.ascending}]);
            }
        }
    }

    protected wheel(deltaMode: number, deltaX: number, deltaY: number) {
        if (this.scrollView) {
            this.scrollView.onScroll(deltaMode, deltaX, deltaY);
        }
    }

    protected dblClick(x: number, y: number) {
        const col = this.findColByPos(x);
        if (y <= this.headerHeight) {
            return;
        }
        const row =  this.findRowByPos(y);
        if (this.allowEdit && row && typeof row.select === "number" && col !== null) {
            if (!col.allowEdit) { return; }

            this.updateForEdit(col, row.select);
        }

        this.fireDblClick(row === null ? null : row.select, col);
    }

    protected abstract updateForEdit(orginalCol: ICanvasTableColumn<T>, row: number): void;

    protected mouseDown(x: number, y: number): void {
        if (this.dataIndex === undefined) { return; }
        if (this.scrollView && this.scrollView.onMouseDown(x, y)) {
            return;
        }
        if (this.dataIndex.mode === CanvasTableMode.ColMode) {
            const dataIndex = this.dataIndex.index;

            const col = this.findColByPos(x);
            if (y <= this.headerHeight) {
                const colSplit = this.findColSplit(x);
                if (colSplit !== null) {
                    this.columnResize = {x, col: this.column[colSplit]};
                    this.askForExtentedMouseMoveAndMaouseUp();
                    this.fireClickHeader(col);
                    return;
                }
                this.clickOnHeader(col);
                this.fireClickHeader(col);
                return;
            }

            const row =  this.findRowByPos(y);
            if (row && typeof row.select === "number" && col !== null) {
                if (this.selectColValue !== col || this.selectRowValue !== row) {
                    this.selectColValue = col;
                    this.selectRowValue = row;
                    this.askForReDraw();
                }
            } else {
                if (dataIndex.type === CanvasTableIndexType.GroupItems) {
                    if (row !== null && typeof row.select === "object") {
                        row.select.isExpended = !row.select.isExpended;
                        this.askForReDraw();
                        this.reCalcForScrollView();
                    }
                }
            }
            this.fireClick(row === null ? null : row.select, col);
        } else {
            const result = this.findColAndRowInRowMode(x, y);
            if (result === null) { return; }

            const { row, col } = result;
            if (col === null) {
                row.isExpended = !row.isExpended;
                this.askForReDraw();
                this.reCalcForScrollView();
            }
        }
    }

    protected mouseMove(x: number, y: number) {
        if (!this.scrollView) { return; }
        if (this.resizeColIfNeed(x)) {
            return;
        }

        if (this.scrollView.onMouseMove(x, y)) {
            this.updateCursor();
            this.setOverRow(undefined);
            return;
        }

        if (y < this.headerHeight) {
            this.setOverRow(undefined);
            if (this.findColSplit(x) === null) {
                this.updateCursor();
            } else {
                this.updateCursor("col-resize");
            }
            return;
        } else {
            this.updateCursor();
            const result = this.findRowByPos(y);
            if (result && typeof result.select === "number") {
                this.setOverRow(result.select);
                return;
            }
            this.setOverRow(undefined);
        }
    }
    protected mouseUp(x: number, y: number) {
        if (this.columnResize) {
            this.columnResize = undefined;
            this.askForNormalMouseMoveAndMaouseUp();
        }
        if (this.scrollView && this.scrollView.onMouseUp(x, y)) { return; }
    }
    protected mouseMoveExtended(x: number, y: number) {
        if (this.resizeColIfNeed(x)) {
            return;
        }

        if (this.scrollView && this.scrollView.onExtendedMouseMove(x, y)) { return; }
    }
    protected mouseUpExtended(x: number, y: number) {
        if (this.columnResize) {
            this.columnResize = undefined;
            this.askForNormalMouseMoveAndMaouseUp();
        }
        if (this.scrollView && this.scrollView.onExtendedMouseUp(x, y)) { return; }
    }
    protected mouseLeave() {
        this.setOverRow(undefined);
        if (this.columnResize === undefined) {
            this.updateCursor();
        }
        if (this.scrollView) {
            this.scrollView.onMouseLeave();
        }
    }

    protected keydown(keycode: number) {
        if (this.scrollView !== undefined &&
            this.selectColValue !== undefined &&
            this.selectRowValue !== null &&
            this.selectRowValue.mode === CanvasTableMode.ColMode &&
            typeof this.selectRowValue.select === "number") {
                const index = this.selectRowValue.path[this.selectRowValue.path.length - 1];
                if (index.type === CanvasTableIndexType.Index) {
                    let y;
                    switch (keycode) {
                        case 40: // Down
                            if (this.selectRowValue.index === index.list.length - 1) { return; }
                            this.selectRowValue.index++;
                            this.selectRowValue.select = index.list[this.selectRowValue.index];
                            y = this.findTopPosByRow(this.selectRowValue);
                            if (y !== undefined) {
                                y = y - (this.canvasHeight -
                                    ((this.headerHeight +
                                        (this.scrollView.getHasScrollBarX() ? this.scrollView.getScrollbarSize() : 0))
                                        * this.r));
                                if (this.scrollView.getPosY() < y) {
                                    this.scrollView.setPosY(y);
                                }
                            }
                            this.askForReDraw();
                            break;
                        case 38: // Up
                            if (this.selectRowValue.index === 0) { return; }
                            this.selectRowValue.index--;
                            this.selectRowValue.select = index.list[this.selectRowValue.index];
                            y = this.findTopPosByRow(this.selectRowValue);
                            if (y !== undefined) {
                                y = y - this.headerHeight * this.r;
                                if (this.scrollView.getPosY() > y) {
                                    this.scrollView.setPosY(y);
                                }
                            }
                            this.askForReDraw();
                            break;
                        case 37: // Left
                            if (this.selectColValue.index === 0) { return; }
                            this.selectColValue =  this.column[this.selectColValue.index - 1];
                            if (this.selectColValue.leftPos < this.scrollView.getPosX()) {
                                this.scrollView.setPosX(this.selectColValue.leftPos);
                            }
                            this.askForReDraw();
                            break;
                        case 39: // Right
                            if (this.selectColValue.index === this.column.length - 1) { return; }
                            this.selectColValue =  this.column[this.selectColValue.index + 1];
                            if (this.selectColValue.rightPos > this.scrollView.getPosX() + this.canvasWidth) {
                                this.scrollView.setPosX(this.selectColValue.rightPos - this.canvasWidth);
                            }
                            this.askForReDraw();
                            break;
                        case 13: // Enter
                            if (this.allowEdit && typeof this.selectRowValue.select === "number") {
                                if (!this.selectColValue.allowEdit) { return; }
                                this.updateForEdit(this.selectColValue, this.selectRowValue.select);
                            }
                        default:
                            // console.log(keycode);
                            break;
                    }
                }
            } else {
                if (this.scrollView && this.scrollView.OnKeydown(keycode)) {
                    this.setOverRow(undefined);
                }
            }
    }

    protected TouchStart(e: ICanvasTableTouchEvent, offsetLeft: number, offsetTop: number) {
        if (this.scrollView && this.scrollView.OnTouchStart(e, offsetLeft, offsetTop)) {
            return;
        }

        if (e.changedTouches.length === 1) {
            const y = e.changedTouches[0].pageY - offsetTop;
            const x = e.changedTouches[0].pageX - offsetLeft;
            this.touchClick = {timeout: setTimeout(() => {
                if (this.dataIndex === undefined) { return; }
                if (this.dataIndex.mode === CanvasTableMode.ColMode) {
                    const row = this.findRowByPos(y);
                    const col = this.findColByPos(x);

                    if (y > this.headerHeight) {
                        if (row !== null && typeof row.select === "object") {
                            row.select.isExpended = !row.select.isExpended;
                            this.askForReDraw();
                            this.reCalcForScrollView();
                        }
                        this.fireClick(row === null ? null : row.select, col);
                    } else {
                        const colSplit = this.findColSplit(x);
                        if (colSplit !== null) {
                            this.columnResize = {x, col: this.column[colSplit]};
                            return;
                        }

                        this.clickOnHeader(col);
                        this.fireClickHeader(col);
                    }
                } else {
                    const result =  this.findColAndRowInRowMode(x, y);
                    if (result === null) { return; }
                    const {col, row} = result;
                    if (col === null) {
                        row.isExpended = !row.isExpended;
                        this.askForReDraw();
                        this.reCalcForScrollView();
                    }
                }
            }, 250), x, y};
        } else {
            this.clearTouchClick();
        }
    }
    protected TouchMove(e: ICanvasTableTouchEvent, offsetLeft: number, offsetTop: number) {
        const x = e.changedTouches[0].pageX - offsetLeft;
        if (this.resizeColIfNeed(x)) {
        //    console.log('R');
            return;
        }
//        console.log('-');
        if (this.scrollView) {
            this.scrollView.OnTouchMove(e, offsetLeft, offsetTop);
        }
        if (this.touchClick) {
            if (e.changedTouches.length !== 1) {
                this.clearTouchClick();
                return;
            }

            const y = e.changedTouches[0].pageY - offsetTop;
            if (Math.abs(x - this.touchClick.x) > 4 || Math.abs(y - this.touchClick.y) > 4) {
                this.clearTouchClick();
            }
        }
    }
    protected TouchEnd(e: ICanvasTableTouchEvent, offsetLeft: number, offsetTop: number) {
        this.columnResize = undefined;

        if (this.scrollView) {
            this.scrollView.OnTouchEnd(e);
        }
    }

    protected calcRect(col: ICanvasTableColumn<T>, row: number): IUpdateRect | undefined {
        if (!this.scrollView ) {
            return;
        }

        const topPos = this.findTopPosByRow(row);
        if (topPos === undefined) {
            return;
        }

        const y = (topPos - this.scrollView.getPosY()) / this.r;
        const x = -(this.scrollView.getPosX() / this.r) + (col.leftPos / this.r);
        const top = y;
        const left = x;

        let clipTop: number | undefined;
        const clipRight: number | undefined = undefined;
        const clipBottom: number | undefined = undefined;
        let clipLeft: number | undefined;

        if (y < this.headerHeight) {
            // rect(<top>, <right>, <bottom>, <left>)
            if (x < 0) {
                clipTop = -y + this.headerHeight;
                clipLeft = -x;
            } else {
                clipTop = -y + this.headerHeight;
            }
        } else if (x < 0) {
            clipLeft = -x;
        }

        return {
            cellHeight: this.cellHeight,
            clipBottom,
            clipLeft,
            clipRight,
            clipTop,
            left,
            top,
            width: col.width,
            x,
            y,
        };

    }

    protected findColSplit(x: number): number | null {
        if (this.scrollView === undefined) { return null; }
        const posXNeg = -this.scrollView.getPosX();
        for (let i = 0; i < this.column.length; i++) {
            const d = ((posXNeg + this.column[i].rightPos) / this.r) - x;
            if (-3 <= d && d <= 3) {
                return i;
            }
        }
        return null;
    }

    protected findColAndRowInRowMode(x: number, y: number):
                                    IColAndRowInRowMode<T> | null {
        if (this.dataIndex === undefined || this.scrollView === undefined) { return null; }
        if (this.dataIndex.mode === CanvasTableMode.ColMode) { return null; }
        let pos = -this.scrollView.getPosY() / this.r;
        const cellHeight = this.cellHeight;
        const find = (index: ICanvasTableGroupItemRowsRowMode | ICanvasTableGroupItemsRowMode):
                    IColAndRowInRowMode<T> | null => {
            let i;
            if (index.type === CanvasTableIndexType.GroupItems) {
                for (i = 0; i < index.list.length; i++) {
                    const item = index.list[i];
                    if (pos < y && y < pos + cellHeight) {
                        return {row: item, col: null};
                    }

                    pos += cellHeight;
                    if (item.isExpended) {
                        const result = find(item.child);
                        if (result != null) {
                            return result;
                        }
                    }
                }
            } else {
                for (i = 0; i < index.list.length; i++) {
                    const item = index.list[i];
                    if (pos < y && y < pos + cellHeight) {
                        return {row: item, col: null};
                    }

                    pos += cellHeight;
                    if (item.isExpended) {
                        let col;
                        for (col = 0; col < this.column.length; col++) {
                            if (pos < y && y < pos + cellHeight) {
                                return {row: item, col: this.column[col]};
                            }

                            pos += cellHeight;
                        }
                    }
                }
            }

            return null;
        };

        return find(this.dataIndex.index);

    }

    protected findColByPos(x: number): ICanvasTableColumn<T> | null {
        if (this.scrollView === undefined) { return null; }
        const pos = this.scrollView.getPosX() / this.r + x;
        let w = 0;
        let i;
        for (i = 0; i < this.column.length; i++) {
            w += this.column[i].width;
            if (w >= pos) {
                return this.column[i];
            }
        }

        return null;
    }
    protected findRowByPos(y: number): CanvasTableRowItemSelect {
        if (this.dataIndex === undefined || this.scrollView === undefined) { return null; }
        if (this.dataIndex.mode === CanvasTableMode.RowMode) { return null; }
        const mode = this.dataIndex.mode;
        let pos = -this.scrollView.getPosY() / this.r + this.headerHeight;
        const cellHeight = this.cellHeight;

        const find = (items: ICanvasTableGroupItemsColMode | ICanvasTableIndexsColMode):
                    ICanvasTableRowItemSelectColMode | null => {
            let i;
            switch (items.type) {
                case CanvasTableIndexType.Index:
                const h = items.list.length * cellHeight;
                if (y > pos + h) {
                    pos += h;
                } else {
                    i = Math.trunc((-pos + y) / cellHeight);
                    pos += i * cellHeight;
                    if (i < items.list.length) {
                        return { mode, path: [items], select: items.list[i], index: i};
                    }
                    return null;
                }
                break;
                case CanvasTableIndexType.GroupItems:
                for (i = 0; i < items.list.length; i++) {
                    if (pos < y && y < pos + cellHeight) {
                        return { mode, path: [items], select: items.list[i], index: i};
                    }
                    pos += cellHeight;
                    if (!items.list[i].isExpended) { continue; }
                    const f = find(items.list[i].child);
                    if (f !== null) {
                        f.path.unshift(items);
                        return f;
                    }
                }
                break;
            }
            return null;
        };

        return find(this.dataIndex.index);
    }
    protected findTopPosByRow(rowValue: number | ICanvasTableRowItemSelectColMode): number | undefined {
        if (this.dataIndex === undefined || this.scrollView === undefined || rowValue === null) { return undefined; }
        if (this.dataIndex.mode === CanvasTableMode.RowMode) { return undefined; }
        let row: number | undefined;
        let rowGroup: ICanvasTableGroupItemColMode | undefined;
        if (typeof rowValue === "number") {
            row = rowValue;
        } else {
            if (typeof rowValue.select === "number") {
                row = rowValue.select;
            } else {
                rowGroup = rowValue.select;
            }
        }
        let pos = this.headerHeight * this.r;
        const cellHeight = this.cellHeight * this.r;

        const find = (items: ICanvasTableGroupItemsColMode | ICanvasTableIndexsColMode): number | undefined => {
            let i;
            switch (items.type) {
                case CanvasTableIndexType.Index:
                    if (row === undefined) {
                        pos += cellHeight * items.list.length;
                    } else {
                        for (i = 0; i < items.list.length; i++) {
                            if (items.list[i] === row) {
                                return pos;
                            }

                            pos += cellHeight;
                        }
                    }
                    break;
                case CanvasTableIndexType.GroupItems:
                    for (i = 0; i < items.list.length; i++) {
                        if (items.list[i] === rowGroup) {
                            return pos;
                        }
                        pos += cellHeight;
                        if (!items.list[i].isExpended) { continue; }
                        const f = find(items.list[i].child);
                        if (f !== undefined) {
                            return f;
                        }
                    }
                    break;
            }

            return undefined;
        };

        return find(this.dataIndex.index);
    }
    protected reCalcIndexIfNeed(field: string) {
        let i;
        if (this.customFilter || this.customSort) {
            this.calcIndex();
            return;
        }

        if (this.groupByCol) {
            for (i = 0; i < this.groupByCol.length; i++) {
                if (this.groupByCol[i].field === field) {
                    this.calcIndex();
                    return;
                }
            }
        }

        if (this.sortCol) {
            for (i = 0; i < this.sortCol.length; i++) {
                if (this.sortCol[i].col.field === field) {
                    this.calcIndex();
                    return;
                }
            }
        }
    }

    protected calcIndex() {
        if (this.data === undefined) {
            return;
        }
        const index: number[] = [];
        let i;
        if (this.customFilter) {
            for (i = 0; i < this.data.length; i++) {
                if (this.customFilter(this.data, this.data[i], this.orgColum, i)) {
                    index[index.length] = i;
                }
            }
        } else {
            for (i = 0; i < this.data.length; i++) {
                index[index.length] = i;
            }
        }

        if (this.customSort) {
            const customSort = this.customSort;
            index.sort((a: number , b: number) => {
                return customSort(this.data, this.data[a], this.data[b], a, b);
            });
        } else {
            const sortCol = this.sortCol;
            if (sortCol && sortCol.length) {
                index.sort((a: number, b: number) => {
                    let sortColIndex;
                    for (sortColIndex = 0; sortColIndex < sortCol.length; sortColIndex++) {
                        let d;
                        const col = sortCol[sortColIndex];
                        switch (col.col.field) {
                            case "__rownum__":
                                d = a - b;
                                if (d !== 0) { return d * col.sort; }
                                break;
                            default:
                                const da = this.getUpdateDataOrData(a, col.col.field);
                                const db = this.getUpdateDataOrData(b, col.col.field);
                                if (da === undefined || da === null) {
                                    if (db === undefined || db === null) {
                                        continue;
                                    }
                                    return col.sort;
                                }
                                if (db === undefined || db === null) {
                                    return -1 * col.sort;
                                }
                                if (typeof da === "string" && typeof db === "string") {
                                    if (da === "") {
                                        if (db === "") {
                                            continue;
                                        }
                                        return col.sort;
                                    }

                                    if (db === "") {
                                        return -1 * col.sort;
                                    }
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
                });
            }
        }

        if (this.rowTableGroup && this.tableMode === CanvasTableMode.RowMode) {
            if (this.groupByCol && this.groupByCol.length > 0) {
                const groupItems: ICanvasTableGroupItemsRowMode = { type: CanvasTableIndexType.GroupItems, list: []};
                this.groupRow(groupItems, index, 0, this.groupByCol, this.rowTableGroup,
                    (this.dataIndex !== undefined && this.dataIndex.index.type === CanvasTableIndexType.GroupItems) ?
                    this.dataIndex.index : undefined);

                this.dataIndex = {
                    index: groupItems,
                    mode: CanvasTableMode.RowMode,
                };
            } else {
                const groupItems: ICanvasTableGroupItemRowsRowMode = { type: CanvasTableIndexType.GroupRows, list: []};
                this.groupRowItem(groupItems, index, this.rowTableGroup,
                    (this.dataIndex !== undefined && this.dataIndex.index.type === CanvasTableIndexType.GroupRows) ?
                    this.dataIndex.index : undefined);

                this.dataIndex = {
                    index: groupItems,
                    mode: CanvasTableMode.RowMode,
                };
            }
        } else {
        if (this.groupByCol && this.groupByCol.length > 0) {
            const groupByCol = this.groupByCol;
            const groupItems: ICanvasTableGroupItemsColMode = {type: CanvasTableIndexType.GroupItems, list: []};
            let oldIndex: ICanvasTableGroupItemsColMode | ICanvasTableGroupItemsRowMode| undefined;
            if (this.dataIndex &&
                this.dataIndex.index.type === CanvasTableIndexType.GroupItems) {
                    oldIndex = this.dataIndex.index;
            }

            this.group(groupItems, index, 0, groupByCol, oldIndex);
            this.dataIndex = { mode: CanvasTableMode.ColMode, index: groupItems };
        } else {
                this.dataIndex =  {
                    index: { type: CanvasTableIndexType.Index, list: index },
                    mode: CanvasTableMode.ColMode,
                };
            }
        }
        this.reCalcForScrollView();
    }
    protected reCalcForScrollView() {
        if (this.dataIndex === undefined) {return; }
        let w: number | undefined = 1;
        if (this.dataIndex.mode === CanvasTableMode.ColMode) {
            if (this.column) {
                let i;
                for (i = 0; i < this.column.length; i++) {
                    w += this.column[i].width * this.r + 0;
                }
            } else {
                w = undefined;
            }
        }

        let h = 0;
        const cellHeight = this.cellHeight;
        const calc = ( index: CanvasTableIndexs ) => {
            let i;
            switch (index.type) {
                case CanvasTableIndexType.Index:
                    h += cellHeight * index.list.length;
                    break;
                case CanvasTableIndexType.GroupItems:
                    for (i = 0; i < index.list.length; i++) {
                        h += cellHeight;
                        if (index.list[i].isExpended) {
                            calc(index.list[i].child);
                        }
                    }
                    break;
                case CanvasTableIndexType.GroupRows:
                    for (i = 0; i < index.list.length; i++) {
                        h += cellHeight;
                        if (index.list[i].isExpended) {
                            h += cellHeight * this.column.length;
                        }
                    }

                    break;
            }
        };

        calc(this.dataIndex.index);
        if (this.scrollView && w !== undefined) {
            this.scrollView.setSize(this.r, this.canvasWidth, this.canvasHeight, w, h * this.r);
            this.fireReCalcForScrollView(w / this.r, h + this.headerHeight);
        }
    }
    protected setCanvasSize(width: number, height: number): void {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.reCalcForScrollView();
    }
    protected doReize(width: number, height: number) {
        this.setCanvasSize(width * this.r, height * this.r);
    }

    protected drawCanvas() {
        if (!this.scrollView || !this.context || !this.dataIndex) {
            return;
        }

        if (this.needToCalc) {
            this.calcColum();
        }

        this.context.font = this.config.fontStyle + " " + this.config.fontSize * this.r + "px " + this.config.font;
        const posX = this.scrollView.getPosX();

        if (this.needToCalcFont) {
            this.minFontWidth = this.context.measureText("i").width;
            this.maxFontWidth = this.context.measureText("Æ").width;
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

        const headderHeight = this.headerHeight * this.r;
        const offsetLeft = 5 * this.r;
        if (drawConf === undefined) {
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }

        this.context.fillStyle = this.config.fontColor;
        this.context.strokeStyle = this.config.lineColor;
        const colStart = 0;
        const colEnd = this.column.length;

        const height = this.cellHeight * this.r;
        const index = this.dataIndex.index;
        let pos: number;
        let i: number;
        let maxPos: number;
        switch (index.type) {
            case CanvasTableIndexType.Index:
                maxPos = this.canvasHeight + this.cellHeight + 5 * this.r;
                i = Math.floor(this.scrollView.getPosY() / (height));
                pos = (-this.scrollView.getPosY() + (i + 1) * height);
                pos += 14 * this.r;
                while (pos < maxPos) {
                    if (i < index.list.length) {
                        this.drawRowItem(this.context, index.list[i], i, pos, posX, height,
                                         offsetLeft, colStart, colEnd, drawConf);
                    } else {
                        break;
                    }

                    pos += height;
                    i++;
                }

                this.context.beginPath();
                const end = pos - height + 4 * this.r;
                const firstLine = -this.scrollView.getPosX() + this.column[colStart].leftPos;
                this.context.moveTo(firstLine, headderHeight);
                this.context.lineTo(firstLine, end);
                for (let col = colStart; col < colEnd; col++) {
                    const rightPos = -this.scrollView.getPosX() + this.column[col].rightPos;
                    this.context.moveTo(rightPos, headderHeight);
                    this.context.lineTo(rightPos, end);
                }
                this.context.stroke();
                break;
            case CanvasTableIndexType.GroupItems:
                pos = -this.scrollView.getPosY();
                maxPos = this.canvasHeight + this.cellHeight + 5 * this.r;
                pos += (this.dataIndex.mode === CanvasTableMode.ColMode ? 14 : -4) * this.r + height;
                i = 0;
                const w = (this.dataIndex.mode === CanvasTableMode.ColMode) ? Math.min(
                    -posX +
                    this.column[this.column.length - 1].rightPos, this.canvasWidth)
                    : this.canvasWidth;
                while (pos < maxPos && index.list.length > i) {
                    const item = index.list[i];
                    pos = this.drawGroupItem(this.context, 1, item, pos, posX, w, height, maxPos, offsetLeft,
                                             colStart, colEnd, drawConf);
                    i++;
                }
                break;
            case CanvasTableIndexType.GroupRows:
                pos = -this.scrollView.getPosY() + height - 4 * this.r;
                this.drawGroupRowsItem(this.context, 1, index, pos, posX, height, offsetLeft, drawConf);
                break;
        }
        if (this.dataIndex.mode === CanvasTableMode.ColMode) {
            // Headder
            pos = 14 * this.r;
            this.context.font = this.config.headerFontStyle + " " +
                (this.config.headerFontSize * this.r) + "px " + this.config.headerFont;
            this.context.fillStyle = this.config.headerFontColor;
            this.context.clearRect(0, 0, this.canvasWidth, headderHeight);
            this.context.beginPath();
            this.context.strokeStyle = this.config.lineColor;

            const leftPos = -this.scrollView.getPosX() + this.column[colStart].leftPos;
            this.context.moveTo(leftPos, 0);
            this.context.lineTo(leftPos, headderHeight);

            for (let col = colStart; col < colEnd; col++) {
                const rightPos = -this.scrollView.getPosX() + this.column[col].rightPos;
                this.context.moveTo(rightPos, 0);
                this.context.lineTo(rightPos, headderHeight);
            }
            this.context.stroke();

            this.context.textAlign = "left";
            for (let col = colStart; col < colEnd; col++) {
                let needClip: boolean;
                const colItem = this.column[col];
                const colWidth = this.column[col].width * this.r - offsetLeft * 2;
                const data = this.column[col].header;
                if (colWidth > data.length * this.maxFontWidth) {
                    needClip = false;
                } else if (colWidth < data.length * this.minFontWidth) {
                    needClip = true;
                } else {
                    needClip = colWidth < this.context.measureText(data).width;
                }

                this.context.fillStyle = this.config.headerBackgroundColor;
                if (needClip) {
                    this.context.fillRect(-posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1,
                        colItem.width * this.r - 1 * 2, height - 3);
                    this.context.save();
                    this.context.beginPath();
                    this.context.rect(-this.scrollView.getPosX() + colItem.leftPos + offsetLeft, pos - height,
                        colItem.width * this.r - offsetLeft * 2, height);
                    this.context.clip();
                    this.context.fillStyle = this.config.headerFontColor;
                    this.context.fillText(data, -this.scrollView.getPosX() + colItem.leftPos + offsetLeft, pos);
                    this.context.restore();
                } else {
                    this.context.fillRect(-posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1,
                        colItem.width * this.r - 1 * 2, height - 3);
                    this.context.fillStyle = this.config.headerFontColor;
                    this.context.fillText(data,  -this.scrollView.getPosX() + colItem.leftPos + offsetLeft, pos);
                }

                if (this.config.headerDrawSortArrow) {
                    let sort: Sort|undefined;
                    if (this.sortCol) {
                        let sortIndex;
                        for (sortIndex = 0; sortIndex < this.sortCol.length; sortIndex++) {
                            if (this.sortCol[sortIndex].col === this.column[col].orginalCol) {
                                sort = this.sortCol[sortIndex].sort;
                                break;
                            }
                        }
                    }
                    if (sort) {
                        this.context.fillStyle = this.config.headerDrawSortArrowColor;
                        const startX =  -this.scrollView.getPosX() + this.column[col].rightPos;
                        if (sort === Sort.ascending) {
                            this.context.beginPath();
                            this.context.moveTo(startX - 12 * this.r, 5 * this.r);
                            this.context.lineTo(startX - 4 * this.r, 5 * this.r);
                            this.context.lineTo(startX - 8 * this.r, 14 * this.r);
                            this.context.fill();
                        } else {
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
            this.context.lineTo(
                Math.min(-this.scrollView.getPosX() + this.column[this.column.length - 1].rightPos, this.canvasWidth),
                pos + 4 * this.r);
            this.context.stroke();
        }
        this.scrollView.draw();
    }
    private calcColum() {
        this.needToCalc = false;
        let leftPos = 1;
        let i;
        for (i = 0; i < this.column.length; i++) {
            this.column[i].leftPos = leftPos;
            leftPos += this.column[i].width * this.r;
            this.column[i].rightPos = leftPos;
        }

        this.reCalcForScrollView();
    }
    private updateCursor(cursor: string = ""): void {
        if (this.lastCursor === cursor) { return; }
        this.lastCursor = cursor;
        this.setCursor(cursor);
    }
    private getEvent(eventName: string): any[] {
        switch (eventName) {
            case "click":
                return this.eventClick;
            case "dblClick":
                return this.eventDblClick;
            case "clickHeader":
                return this.eventClickHeader;
            case "reCalcForScrollView":
                return this.eventReCalcForScrollView;
            default:
                throw new Error("unknown;");
        }
    }

    private resizeColIfNeed(x: number): boolean {
        if (this.columnResize === undefined) { return false; }
        const d = x - this.columnResize.x;
        const col = this.columnResize.col;
        if (d === 0 || col.width + d < 10) { return true; }
        col.width += d;
        this.columnResize.x = x;
        col.orginalCol.width = col.width;
        this.calcColum();
        this.askForReDraw();
        return true;
    }

    private clearTouchClick() {
        if (this.touchClick) {
            clearTimeout(this.touchClick.timeout);
            this.touchClick = undefined;
        }
    }

    private changeChildExpend(g: ICanvasTableGroupItemsColMode |
            ICanvasTableGroupItemRowsRowMode | ICanvasTableGroupItemsRowMode,
                              value: boolean) {
        let i;
        for (i = 0; i < g.list.length; i++) {
            const item = g.list[i];
            item.isExpended = value;
            if ("child" in item) {
                const child = item.child;
                if (child.type === CanvasTableIndexType.GroupItems) {
                    this.changeChildExpend(child, value);
                }
            }
        }
    }

    private drawGroupItemObject(context: ICanvasContext2D, pos: number, posX: number,
                                isExpended: boolean, caption: string,
                                level: number, w: number, height: number, rowMode: boolean) {
        context.fillStyle = rowMode ? this.config.rowGroupItemBackgroundColor : this.config.groupItemBackgroundColor;
        context.fillRect(0 , pos - height + 4 * this.r + 1, w, height - 3);

        context.fillStyle = rowMode ? this.config.rowGroupItemArrowColor : this.config.groupItemArrowColor;
        context.beginPath();
        if (isExpended) {
            context.moveTo(-posX + (9 + 10 * (level - 1)) * this.r, pos - this.r * 10);
            context.lineTo(-posX + (5 + 10 * (level - 1)) * this.r, pos);
            context.lineTo(-posX + (2 + 10 * (level - 1)) * this.r, pos - this.r * 10);
        } else {
            context.moveTo(-posX + (9 + 10 * (level - 1)) * this.r, pos - this.r * 5);
            context.lineTo(-posX + (2 + 10 * (level - 1)) * this.r, pos);
            context.lineTo(-posX + (2 + 10 * (level - 1)) * this.r, pos - this.r * 10);
        }

        context.fill();

        context.fillStyle = rowMode ? this.config.rowGroupItemFontColor : this.config.groupItemFontColor;
        context.textAlign = "left";
        context.fillText(caption, -posX + (20 + 10 * (level - 1)) * this.r, pos);

        context.beginPath();
        context.moveTo(0, pos + 4 * this.r);
        context.lineTo(w, pos + 4 * this.r);
        context.stroke();

    }
    private getGroupCaption(item: ICanvasTableGroupItemColMode | ICanvasTableGroupItemRowMode): string {
        if (item.aggregate) {
            return item.caption + " " + item.aggregate;
        }

        return item.caption + " (" + item.child.list.length + ")";
    }
    private group(g: ICanvasTableGroupItemsColMode, index: number[], level: number,
                  groupByCol: ICanvasTableGroup[],
                  old: ICanvasTableGroupItemsColMode | ICanvasTableGroupItemsRowMode | undefined) {

        const r = new Map<string, number[]>();
        let i;
        const groupItem = groupByCol[level];
        for (i = 0; i < index.length; i++) {
            const id = index[i];
            const c = String(this.getUpdateDataOrData(id, groupItem.field));
            const d = r.get(c);
            if (d !== undefined) {
                d.push(id);
            } else {
                r.set(c, [id]);
            }
        }

        level++;
        const oldMap = new Map<string, ICanvasTableGroupItemRowMode | ICanvasTableGroupItemColMode>();
        if (old !== undefined) {
            let oldIndex;
            for (oldIndex = 0; oldIndex < old.list.length; oldIndex++) {
                const oldItem = old.list[oldIndex];
                oldMap.set(oldItem.caption, oldItem);
            }
        }
        const keys = r.keys();
        let f = keys.next();
        while (!f.done) {
            const caption = f.value;
            const ids = r.get(caption);
            if (!ids) { break; }

            const oldItem = oldMap.get(caption);
            if (level === groupByCol.length) {
                g.list.push({ caption,
                    child: {list: ids, type: CanvasTableIndexType.Index },
                    isExpended: oldItem?.isExpended || false,
                });
            } else {
                const child: ICanvasTableGroupItemsColMode = {
                    list: [],
                    type: CanvasTableIndexType.GroupItems,
                };
                this.group(child, ids, level, groupByCol,
                    (oldItem !== undefined && oldItem.child.type === CanvasTableIndexType.GroupItems)
                    ? oldItem.child : undefined);
                const item: ICanvasTableGroupItemColMode = { caption, isExpended: oldItem?.isExpended || false, child };
                g.list.push(item);
                if (groupItem.aggregate) {
                    try {
                    item.aggregate = groupItem.aggregate(item);
                    } catch (ex) {
                        this.logError("groupRow", item, ex);
                    }
                }
            }
            f = keys.next();
        }
    }

    private groupRow(g: ICanvasTableGroupItemsRowMode,
                     index: number[], level: number,
                     groupByCol: ICanvasTableGroup[], rowTableGroup: ICanvasRowTableGroup,
                     old: ICanvasTableGroupItemsRowMode | ICanvasTableGroupItemsColMode | undefined) {
        const r = new Map<string, number[]>();
        let i;
        const groupItem = groupByCol[level];
        for (i = 0; i < index.length; i++) {
            const id = index[i];
            const c = String(this.getUpdateDataOrData(id, groupItem.field));
            const d = r.get(c);
            if (d !== undefined) {
                d.push(id);
            } else {
                r.set(c, [id]);
            }
        }

        level++;
        const oldMap = new Map<string, ICanvasTableGroupItemRowMode | ICanvasTableGroupItemColMode>();
        if (old !== undefined) {
            let oldIndex;
            for (oldIndex = 0; oldIndex < old.list.length; oldIndex++) {
                const oldItem = old.list[oldIndex];
                oldMap.set(oldItem.caption, oldItem);
            }
        }
        const keys = r.keys();
        let f = keys.next();
        while (!f.done) {
            const caption = f.value;
            const ids = r.get(caption);
            if (!ids) { break; }

            const oldItem = oldMap.get(caption);
            if (level === groupByCol.length) {
                const child: ICanvasTableGroupItemRowsRowMode = {
                    list: [],
                    type: CanvasTableIndexType.GroupRows,
                };
                this.groupRowItem(child, ids, rowTableGroup,
                    (oldItem !== undefined && oldItem.child.type === CanvasTableIndexType.GroupRows)
                    ? oldItem.child : undefined);
                g.list.push({ caption, isExpended: oldItem?.isExpended || false, child });
            } else {
                const child: ICanvasTableGroupItemsRowMode = {
                    list: [],
                    type: CanvasTableIndexType.GroupItems,
                };
                this.groupRow(child, ids, level, groupByCol, rowTableGroup,
                    (oldItem !== undefined && oldItem.child.type === CanvasTableIndexType.GroupItems)
                    ? oldItem.child : undefined);
                const item: ICanvasTableGroupItemRowMode = { caption, isExpended: oldItem?.isExpended || false, child };
                g.list.push(item);
                if (groupItem.aggregate) {
                    try {
                    item.aggregate = groupItem.aggregate(item);
                    } catch (ex) {
                        this.logError("groupRow", item, ex);
                    }
                }
            }
            f = keys.next();
        }
    }

    private groupRowItem(g: ICanvasTableGroupItemRowsRowMode,
                         index: number[], rowTableGroup: ICanvasRowTableGroup,
                         old: ICanvasTableGroupItemRowsRowMode | undefined) {
        let i;
        const oldMap = new Map<number, boolean>();
        if (old !== undefined) {
            let oldIndex;
            for (oldIndex = 0; oldIndex < old.list.length; oldIndex++) {
                const oldItem = old.list[oldIndex];
                oldMap.set(oldItem.index, oldItem.isExpended);
            }
        }
        for (i = 0; i < index.length; i++) {
            const id = index[i];
            const isExpended = oldMap.get(id) || false;

            const c = String(this.getUpdateDataOrData(id, rowTableGroup.field));
            const groupRow: ICanvasTableIndexsRowMode = {
                caption: c,
                index: id,
                isExpended,
            };

            g.list.push(groupRow);
            if (rowTableGroup.aggregate) {
                try {
                    groupRow.aggregate = rowTableGroup.aggregate(groupRow);
                } catch (ex) {
                    this.logError("groupRow", groupRow, ex);
                }
            }
        }
    }

    private drawGroupRowsItem(context: ICanvasContext2D, level: number, groupRows: ICanvasTableGroupItemRowsRowMode,
                              pos: number, posX: number,
                              height: number, offsetLeft: number, drawConf: IDrawConfig | undefined): number {
        let i = 0;
        for (; i < groupRows.list.length; i++) {
            const item = groupRows.list[i];
            let add = height;
            if (item.isExpended) {
                add += height * this.column.length;
            }

            if (pos + add < 0) {
                pos += add;
                continue;
            }

            break;
        }

        for (; i < groupRows.list.length; i++) {
            const item = groupRows.list[i];
            let caption =  item.caption;
            if (item.aggregate) {
                caption += " " + item.aggregate;
            }
            this.drawGroupItemObject(context, pos, posX, item.isExpended, caption,
                                     level, this.canvasWidth, height, true);
            pos += height;
            if (item.isExpended) {
                pos = this.drawGroupRowItem(context, i, item, pos, height);
            }

            if (this.canvasHeight < pos) {
                return pos;
            }
        }

        return pos;
    }
    private drawGroupRowItem(context: ICanvasContext2D, indexId: number, item: ICanvasTableIndexsRowMode,
                             pos: number, height: number): number {
        let i;
        const isOver = this.overRowValue === indexId;
        const isSepra =  indexId % 2 === 0;
        for (i = 0; i < this.column.length; i++) {
            const col = this.column[i];
            const data = this.getDrawData(col, item.index, indexId);

            let customStyle: ICanvasTableRowColStyle | undefined | null;
            if (this.customRowColStyle) {
                try {
                    customStyle = this.customRowColStyle(
                        this.data, this.data[indexId], col.orginalCol, isOver, isSepra, data);
                } catch {
                    this.logError("Canvas Table customRowColStyle");
                }
            }

            if (!customStyle) {
                customStyle = {};
            }

            if (customStyle.backgroundColor !== undefined) {
                context.fillStyle = customStyle.backgroundColor;
            } else {
                if (isOver) {
                    context.fillStyle = this.config.howerBackgroundColor;
                } else {
                    context.fillStyle = isSepra ?  this.config.sepraBackgroundColor : this.config.backgroundColor ;
                }
            }

            let lastFont;
            if (customStyle.font !== undefined || customStyle.fontSize !== undefined ||
                customStyle.fontStyle !== undefined) {
                lastFont = context.font;
                context.font =
                    (customStyle.fontStyle === undefined ? this.config.fontStyle : customStyle.fontStyle)
                     + " " +
                    (customStyle.fontSize === undefined ? this.config.fontSize : customStyle.fontSize)
                     * this.r + "px " +
                    (customStyle.font === undefined ? this.config.font : customStyle.font);
            }

            context.fillStyle = customStyle.fontColor === undefined ?
                this.config.fontColor : customStyle.fontColor;
            context.fillText(col.header, 5 * this.r, pos);
            context.fillText(data, 150 * this.r, pos);

            if (lastFont) {
                context.font = lastFont;
            }

            pos += height;
            if (this.canvasHeight < pos) {
                return pos;
            }
        }
        return pos;
    }
    private drawGroupItem(context: ICanvasContext2D, level: number,
                          groupItem: ICanvasTableGroupItemRowMode | ICanvasTableGroupItemColMode,
                          pos: number, posX: number, w: number,
                          height: number,  maxPos: number, offsetLeft: number, colStart: number, colEnd: number,
                          drawConf: IDrawConfig | undefined): number {
        if (pos > 0 && drawConf === undefined) {
            if (this.groupByCol && level <= this.groupByCol.length) {
                const groupByColItem = this.groupByCol[level - 1];
                if (groupByColItem.renderer) {
                    const left = 0;
                    const top = pos - height + 4 * this.r + 1;
                    const renderer = groupByColItem.renderer;
                    context.save();
                    context.beginPath();
                    context.rect(left, top, w, height);
                    context.clip();
                    try {
                        const right = w;
                        const bottom = top + height;
                        renderer(groupItem, this, context,
                                left, top, right, bottom, w, height, this.r);
                    } catch (e) {
                        this.logError("CanvasTable drawGroupItem renderer", this.groupByCol[level], e);
                    }

                    context.restore();
                } else {
                    this.drawGroupItemObject(context, pos, posX, groupItem.isExpended, this.getGroupCaption(groupItem),
                                             level, w, height, false);
                }
            } else {
                this.drawGroupItemObject(context, pos, posX, groupItem.isExpended, this.getGroupCaption(groupItem),
                                         level, w, height, false);
            }
        }

        pos += height;
        if (groupItem.isExpended) {
            const child = groupItem.child;
            let i;
            switch (child.type) {
                case CanvasTableIndexType.Index:
                    if (0 > pos + child.list.length * height) {
                        pos += child.list.length * height;
                    } else {
                        i = 0;
                        if (pos < -height) {
                            i = Math.trunc(-pos / height);
                            pos += i * height;
                        }
                        if (drawConf === undefined) {
                            context.strokeStyle = this.config.lineColor;
                            context.beginPath();
                            context.moveTo(0, pos + 4 * this.r + 1 - height);
                            context.lineTo(
                                -posX + this.column[this.column.length - 1].rightPos,
                                pos + 4 * this.r + 1 - height);
                            context.stroke();
                        }
                        const startPos = pos;
                        for (; i < child.list.length && pos < maxPos; i++) {
                            const item = child.list[i];
                            if (pos > 0) {
                                this.drawRowItem(context, item, i, pos, posX, height,
                                                 offsetLeft, colStart, colEnd, drawConf);
                            }
                            pos += height;
                        }

                        const start = startPos + 4 * this.r + 1 - height;
                        const end =  pos + 4 * this.r + 1 - height;
                        const leftPos = -posX + this.column[colStart].leftPos;
                        context.beginPath();
                        context.moveTo(leftPos, start);
                        context.lineTo(leftPos, end);

                        for (let col = colStart; col < colEnd; col++) {
                            const colItem = this.column[col];
                            context.moveTo( -posX + colItem.rightPos, start);
                            context.lineTo( -posX + colItem.rightPos, end);
                        }

                        context.stroke();
                    }
                    break;
                case CanvasTableIndexType.GroupItems:
                    for (i = 0; i < child.list.length && pos < maxPos; i++) {
                        const item = child.list[i];
                        pos = this.drawGroupItem(context, level + 1, item, pos, posX, w, height, maxPos,
                                                 offsetLeft, colStart, colEnd, drawConf);
                    }
                    break;
                case CanvasTableIndexType.GroupRows:
                    pos = this.drawGroupRowsItem(context, level + 1, child, pos, posX, height, offsetLeft, drawConf);
                    break;
            }
        }
        return pos;

    }

    private getDrawData(colItem: ICanvasTableColumn<T>, rowId: number, indexId: number): string {
        let data: string;
        switch (colItem.field) {
            case "__rownum__":
                data = rowId.toString();
                break;
            case "__idxnum__":
                data = indexId.toString();
                break;
            default:
                data = String(this.getUpdateDataOrData(rowId, colItem.field));
        }

        if (colItem.customData) {
            data = colItem.customData(this, data, this.data[rowId], this.data, rowId, colItem);
        }

        return data;
    }

    private drawRowItem(context: ICanvasContext2D, indexId: number, i: number, pos: number, posX: number,
                        height: number, offsetLeft: number, colStart: number, colEnd: number,
                        drawConf: IDrawConfig | undefined): void {
        if (drawConf !== undefined && drawConf.drawOnly !== undefined) {
            let found = false;
            let index;
            for (index = 0; index < drawConf.drawOnly.length; index++) {
                if (drawConf.drawOnly[index] === indexId) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                return;
            }
        }
        const isOver = this.overRowValue === indexId;
        const isSepra =  i % 2 === 0;

        for (let col = colStart; col < colEnd; col++) {
            const colItem = this.column[col];
            const data = this.getDrawData(colItem, indexId, i);

            if (colItem.renderer) {
                const left =  -posX + colItem.leftPos + 1;
                const top = pos - height + 4 * this.r + 1;
                const width = colItem.width * this.r - 2;
                const h = height - 2;
                context.save();
                context.beginPath();
                context.rect(left, top, width, h);
                context.clip();
                try {
                    colItem.renderer(this, context, indexId, this.orgColum[col],
                        left, top, left + width, top + h, width, h, this.r,
                        data, this.data[indexId], this.data);
                } catch (e) {
                    this.logError("CanvasTable renderer", colItem.header, e);
                }

                context.restore();
                continue;
            }

            let customStyle: ICanvasTableRowColStyle | undefined | null;
            if (this.customRowColStyle) {
                try {
                    customStyle = this.customRowColStyle(
                        this.data, this.data[indexId], colItem.orginalCol, isOver, isSepra, data);
                } catch {
                    this.logError("Canvas Table customRowColStyle");
                }
            }

            if (!customStyle) {
                customStyle = {};
            }

            let needClip: boolean;
            const colWidth = colItem.width * this.r - offsetLeft * 2;
            if (data === null || data === undefined) {
                return;
            }
            if (colWidth > data.length * this.maxFontWidth) {
                needClip = false;
            } else if (colWidth < data.length * this.minFontWidth) {
                needClip = true;
            } else {
                needClip = colWidth < context.measureText(data).width;
            }

            let x;
            switch (customStyle.align === undefined ? colItem.align : customStyle.align) {
                case Align.left:
                default:
                    x = colItem.leftPos + offsetLeft;
                    if (context.textAlign !== "left") {
                        context.textAlign = "left";
                    }
                    break;
                case Align.right:
                    x = colItem.rightPos - offsetLeft;
                    if (context.textAlign !== "right") {
                        context.textAlign = "right";
                    }
                    break;
                case Align.center:
                    x = colItem.leftPos + colItem.width * this.r * 0.5 - offsetLeft;
                    if (context.textAlign !== "center") {
                        context.textAlign = "center";
                    }
                    break;
            }

            if (customStyle.backgroundColor !== undefined) {
                context.fillStyle = customStyle.backgroundColor;
            } else {
                if (isOver) {
                    context.fillStyle = this.config.howerBackgroundColor;
                } else {
                    context.fillStyle = isSepra ?  this.config.sepraBackgroundColor : this.config.backgroundColor ;
                }
            }

            let lastFont;
            if (customStyle.font !== undefined || customStyle.fontSize !== undefined ||
                customStyle.fontStyle !== undefined) {
                lastFont = context.font;
                context.font =
                    (customStyle.fontStyle === undefined ? this.config.fontStyle : customStyle.fontStyle)
                     + " " +
                    (customStyle.fontSize === undefined ? this.config.fontSize : customStyle.fontSize)
                     * this.r + "px " +
                    (customStyle.font === undefined ? this.config.font : customStyle.font);
            }

            if (needClip) {
                context.fillRect(-posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1,
                     colItem.width * this.r - 1 * 2, height - 3);
                context.save();
                context.beginPath();
                context.rect(-posX + colItem.leftPos + offsetLeft, pos - height,
                     colItem.width * this.r - offsetLeft * 2, height);
                context.clip();
                context.fillStyle = customStyle.fontColor === undefined ?
                                         this.config.fontColor : customStyle.fontColor;
                context.fillText(data, -posX + x, pos);
                context.restore();
            } else {
                context.fillRect(-posX + colItem.leftPos + 1, pos - height + 4 * this.r + 1,
                                      colItem.width * this.r - 1 * 2, height - 3);
                context.fillStyle = customStyle.fontColor === undefined ?
                                         this.config.fontColor : customStyle.fontColor;
                context.fillText(data, -posX + x, pos);
            }
            if (lastFont) {
                context.font = lastFont;
            }
        }

        if (drawConf === undefined) {
            context.beginPath();
            context.moveTo(0, pos + 4 * this.r);
            context.lineTo(
                                Math.min(-posX + this.column[this.column.length - 1].rightPos,
                                this.canvasWidth), pos + 4 * this.r);
            context.stroke();
        }

        if (this.allowEdit && this.isFocus &&
             this.selectRowValue && this.selectRowValue.select === indexId &&
             this.selectColValue !== undefined) {
            for (let col = colStart; col < colEnd; col++) {
                if (this.selectColValue.index === col) {
                    const lastStroke = context.strokeStyle;
                    const lastLineWidth = context.lineWidth;
                    context.strokeStyle = this.config.selectLineColor;
                    context.lineWidth = 3;
                    context.beginPath();
                    context.rect(-posX + this.selectColValue.leftPos + 2,
                        pos + 4 * this.r - this.cellHeight * this.r + 2,
                        this.selectColValue.width * this.r - 4, this.cellHeight * this.r - 4);
                    context.stroke();
                    context.strokeStyle = lastStroke;
                    context.lineWidth = lastLineWidth;
                    break;
                }
            }
        }
    }
}
