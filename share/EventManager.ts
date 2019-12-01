import { ICanvasTableColumnConf } from "./CanvasTableColum";
import { RowItem } from "./CustomCanvasIndex";
import { CustomCanvasTable } from "./CustomCanvasTable";
import { ScrollView } from "./ScrollView";

export type EventManagerClick = (customCanvasTable: CustomCanvasTable,
                                 row: RowItem, col: ICanvasTableColumnConf | null) => void;
export type EventManagerClickHeader = (customCanvasTable: CustomCanvasTable,
                                       col: ICanvasTableColumnConf | null) => void;
export type EventManagerReCalcForScrollView = (customCanvasTable: CustomCanvasTable, scrollView: ScrollView) => void;
