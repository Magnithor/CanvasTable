import { Drawable } from "./Drawable";
import { ScrollView, ScrollViewConfig } from "./ScrollView";
import { CanvasContext2D, CanvasColor } from "./CanvasContext2D";
import { CanvasTableTouchEvent } from "./CanvasTableTouchEvent";
import { Align, RenderValue, CustomData, CanvasTableColumnConf, CustomFilter, CustomSort, CanvasTableColumnSort } from "./CanvasTableColum";
import { IndexType, GroupItem } from "./CustomCanvasIndex";
export interface DrawConfig {
    drawOnly?: number[];
}
export interface CanvasTableConfig {
    scrollView?: ScrollViewConfig;
    font?: string;
    fontStyle?: string;
    fontSize?: number;
    fontColor?: CanvasColor;
    headerFont?: string;
    headerFontStyle?: string;
    headerFontSize?: number;
    headerFontColor?: CanvasColor;
    headerDrawSortArrow?: boolean;
    backgroundColor?: CanvasColor;
    lineColor?: CanvasColor;
    howerBackgroundColor?: CanvasColor;
    sepraBackgroundColor?: CanvasColor;
}
interface CanvasTableConf {
    scrollView?: ScrollViewConfig;
    font: string;
    fontStyle: string;
    fontSize: number;
    fontColor: CanvasColor;
    headerFont: string;
    headerFontStyle: string;
    headerFontSize: number;
    headerFontColor: CanvasColor;
    headerDrawSortArrow: boolean;
    backgroundColor: CanvasColor;
    lineColor: CanvasColor;
    howerBackgroundColor: CanvasColor;
    sepraBackgroundColor: CanvasColor;
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
    protected config: CanvasTableConf;
    constructor(config: CanvasTableConfig | undefined);
    isPlanToRedraw(): boolean;
    askForReDraw(config?: DrawConfig): void;
    setFilter(filter?: CustomFilter | null): void;
    setCustomSort(customSort?: CustomSort | null): void;
    setSort(sortCol?: CanvasTableColumnSort[]): void;
    setGroupBy(col?: string[]): void;
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
    protected findColByPos(x: number): CanvasTableColumn | null;
    protected findRowByPos(y: number): number | GroupItem | null;
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
