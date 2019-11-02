import { Drawable } from "./Drawable";
import { ScrollView } from "./ScrollView";
import { CanvasContext2D } from "./CanvasContext2D";
import { CanvasTableTouchEvent } from "./CanvasTableTouchEvent";
export interface DrawConfig {
    drawOnly?: number[];
}
declare type CustomData = (canvasTable: CustomCanvasTable, dataValue: any, row: any, data: any, rowIndex: number, col: CanvasTableColumnConf) => string;
declare type RenderValue = (canvasTable: CustomCanvasTable, context: CanvasContext2D, rowIndex: number, col: CanvasTableColumnConf, left: number, top: number, right: number, bottom: number, width: number, height: number, r: number, dataValue: any, row: any, data: any) => void;
export declare type CustomFilter = (data: any, row: any, col: CanvasTableColumnConf[]) => boolean;
export declare type CustomSort = (data: any, rowA: any, rowB: any) => number;
export interface CanvasTableColumnConf {
    header: string;
    field: string;
    width?: number;
    align?: Align;
    visible?: boolean;
    renderer?: RenderValue;
    customData?: CustomData;
}
export interface CanvasTableColumnSort {
    col: CanvasTableColumnConf;
    sort: Sort;
}
export declare enum Align {
    left = 0,
    center = 1,
    right = 2
}
export declare enum Sort {
    ascending = 1,
    descending = -1
}
export declare enum ItemIndexType {
    GroupItems = 0,
    Index = 1
}
export interface GroupItems {
    type: ItemIndexType.GroupItems;
    list: GroupItem[];
}
export interface GroupItem {
    caption: string;
    child: (GroupItems | Index);
    isExpended: boolean;
}
export interface Index {
    type: ItemIndexType.Index;
    list: number[];
}
export declare type IndexType = Index | GroupItems;
export declare abstract class CustomCanvasTable implements Drawable {
    private needToCalc;
    private needToCalcFont;
    protected context?: CanvasContext2D;
    protected requestAnimationFrame?: number;
    protected drawconf?: DrawConfig & {
        fulldraw: boolean;
    };
    protected r: number;
    protected data: any[];
    private minFontWidth;
    private maxFontWidth;
    protected scrollView?: ScrollView;
    protected font: string;
    protected cellHeight: number;
    protected dataIndex?: IndexType;
    private column;
    private orgColum;
    private cusomFilter?;
    private customSort?;
    private sortCol?;
    private groupByCol?;
    private overRowValue?;
    private touchClick?;
    private canvasHeight;
    private canvasWidth;
    isPlanToRedraw(): boolean;
    askForReDraw(config?: DrawConfig): void;
    setFilter(filter?: CustomFilter | null): void;
    setCustomSort(customSort?: CustomSort | null): void;
    setSort(sortCol?: CanvasTableColumnSort[]): void;
    setGroupBy(col: string[]): void;
    setData(data?: any[]): void;
    setColumnVisible(col: number, visible: boolean): void;
    UpdateColumns(col: CanvasTableColumnConf[]): void;
    private calcColum;
    protected setR(r: number): void;
    protected abstract resize(): void;
    expendedAll(): void;
    collapseAll(): void;
    protected wheel(deltaMode: number, deltaX: number, deltaY: number): void;
    protected mouseDown(x: number, y: number): void;
    protected mouseMove(x: number, y: number): void;
    protected mouseUp(x: number, y: number): void;
    protected mouseMoveExtended(x: number, y: number): void;
    protected mouseUpExtended(x: number, y: number): void;
    protected mouseLeave(): void;
    protected keydown(keycode: number): void;
    protected TouchStart(e: CanvasTableTouchEvent, offsetLeft: number, offsetTop: number): void;
    protected TouchMove(e: CanvasTableTouchEvent, offsetLeft: number, offsetTop: number): void;
    protected TouchEnd(e: CanvasTableTouchEvent, offsetLeft: number, offsetTop: number): void;
    private clearTouchClick;
    protected findByPos(y: number): number | GroupItem | null;
    protected overRow: number | undefined;
    protected calcIndex(): void;
    private tryFind;
    private group;
    private changeChildExpended;
    protected reCalcForScrollView(): void;
    protected setCanvasSize(width: number, height: number): void;
    protected doReize(width: number, height: number): void;
    protected drawCanvas(): void;
    private drawGroupItem;
    private drawRowItem;
}
export {};
