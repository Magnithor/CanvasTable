import { CanvasTableColumnConf } from "./CanvasTableColum";
import { RowItem } from "./CustomCanvasIndex";


export type EventManagerClick = (row:RowItem, col:CanvasTableColumnConf|null)=>void;
export type EventManagerClickHeader = (col:CanvasTableColumnConf|null)=>void;
