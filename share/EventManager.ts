import { ICanvasTableColumnConf } from "./CanvasTableColum";
import { CanvasTableRowItem } from "./CustomCanvasIndex";
import { CustomCanvasTable } from "./CustomCanvasTable";
import { ScrollView } from "./ScrollView";

export type EventManagerClick<T> = (customCanvasTable: CustomCanvasTable,
                                    row: CanvasTableRowItem, col: ICanvasTableColumnConf<T> | null) => void;
export type EventManagerClickHeader<T> = (customCanvasTable: CustomCanvasTable,
                                          col: ICanvasTableColumnConf<T> | null) => void;
export type EventManagerReCalcForScrollView = (
    customCanvasTable: CustomCanvasTable, width: number, height: number, scrollView: ScrollView) => void;

export type EventManagerEdit = (customCanvasTable: CustomCanvasTable,
                                row: CanvasTableRowItem, col: string,
                                newData: any, oldData: any) => void;
