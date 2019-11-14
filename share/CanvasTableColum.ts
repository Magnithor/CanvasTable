import { CustomCanvasTable } from "./CustomCanvasTable";
import { CanvasContext2D, CanvasColor } from "./CanvasContext2D";

export type CustomData = (canvasTable: CustomCanvasTable, dataValue: any, row: any, data: any, rowIndex: number, col: CanvasTableColumnConf) => string;
export type RenderValue = (canvasTable: CustomCanvasTable, context: CanvasContext2D, rowIndex: number, col: CanvasTableColumnConf, left: number, top: number, right: number, bottom: number, width: number, height: number, r: number, dataValue: any, row: any, data: any) => void;
export type CustomFilter = (data: any, row: any, col: CanvasTableColumnConf[]) => boolean;
export type CustomRowColStyle = (data:any, row: any, col: CanvasTableColumnConf, isOver: boolean, isSepra: boolean, dataRowCol: string) => CanvasTableRowColStyle|undefined|null;
/**
 * function pointer to custom sort
 * @param data  data Same array that was sent to CanvasTable, this array is not modified
 * @param rowA  row A
 * @param rowB  row B
 * @returns 
 *      if rowA > rowB then return 1
 *      if rowA < rowB then return -1 
 *      if rowA == rowB then return 0
 */
export type CustomSort = (data: any[], rowA: any, rowB: any) => number;


/**
 * CanvasTableRowColStyle interface is return in [[CustomRowColStyle]]
 */
export interface CanvasTableRowColStyle {
    /**
     * Font name
     */
    font?: string,
    /**
     * Font style example bold
     */
    fontStyle?: string,
    /**
     * Font size in px
     */
    fontSize?: number,
    /**
     * Font color
     */
    fontColor?: CanvasColor,
    /**
     * background color in the cell
     */
    backgroundColor?: CanvasColor,
    /**
     * Text align: left, center, right
     */
    align?: Align
}

/**
 * Canvas Table Column Config
 */
export interface CanvasTableColumnConf {
    /**
     * Text in header
     */
    header: string;
    /**
     * Property field in data
     */
    field: string;
    /**
     * Width of the column
     */
    width?: number;
    /**
     * Align render data in the table. default Align.left
     */
    align?: Align;
    /**
     * Visible of the column. default visible
     */
    visible?: boolean;
    /**
     * function pointer to render the data with canvas
     */
    renderer?: RenderValue;
    /**
     * function pointer to render string.
     */
    customData?: CustomData;
}

export interface CanvasTableColumnSort {
    col: CanvasTableColumnConf,
    sort: Sort
}

/**
 * Align text 
 */
export enum Align { left, center, right }
export enum Sort { ascending = 1, descending = -1 }
