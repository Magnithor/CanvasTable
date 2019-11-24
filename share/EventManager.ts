import { ICanvasTableColumnConf } from "./CanvasTableColum";
import { RowItem } from "./CustomCanvasIndex";

export type EventManagerClick = (row: RowItem, col: ICanvasTableColumnConf | null) => void;
export type EventManagerClickHeader = (col: ICanvasTableColumnConf | null) => void;
