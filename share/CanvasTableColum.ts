import { CustomCanvasTable } from "./CustomCanvasTable";
import { CanvasContext2D } from "./CanvasContext2D";

export type CustomData = (canvasTable: CustomCanvasTable, dataValue: any, row: any, data: any, rowIndex: number, col: CanvasTableColumnConf) => string;
export type RenderValue = (canvasTable: CustomCanvasTable, context: CanvasContext2D, rowIndex: number, col: CanvasTableColumnConf, left: number, top: number, right: number, bottom: number, width: number, height: number, r: number, dataValue: any, row: any, data: any) => void;
export type CustomFilter = (data: any, row: any, col: CanvasTableColumnConf[]) => boolean;
export type CustomSort = (data: any, rowA: any, rowB: any) => number;

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
    col: CanvasTableColumnConf,
    sort: Sort
}

export enum Align { left, center, right }
export enum Sort { ascending = 1, descending = -1 }
