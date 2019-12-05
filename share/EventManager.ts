import { ICanvasTableColumnConf } from "./CanvasTableColum";
import { RowItem } from "./CustomCanvasIndex";
import { CustomCanvasTable } from "./CustomCanvasTable";
import { ScrollView } from "./ScrollView";

export type EventManagerClick<T> = (customCanvasTable: CustomCanvasTable,
                                    row: RowItem, col: ICanvasTableColumnConf<T> | null) => void;
export type EventManagerClickHeader<T> = (customCanvasTable: CustomCanvasTable,
                                          col: ICanvasTableColumnConf<T> | null) => void;
export type EventManagerReCalcForScrollView = (
    customCanvasTable: CustomCanvasTable, width: number, height: number, scrollView: ScrollView) => void;
