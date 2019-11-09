import { CanvasTableColumnConf } from "./CanvasTableColum";
import { rowItem } from "./CustomCanvasTable";

export type EventManagerClick = (row:rowItem, col:CanvasTableColumnConf|null)=>void;
export type EventManagerClickHeader = (col:CanvasTableColumnConf|null)=>void;
