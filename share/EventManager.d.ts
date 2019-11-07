import { CanvasTableColumnConf } from "./CanvasTableColum";
export declare type EventManagerClick = (rowId: number, col: CanvasTableColumnConf) => void;
export declare type EventManagerClickHeader = (col: CanvasTableColumnConf) => void;
export declare class EventManager {
    private eventClick;
    private eventClickHeader;
    EventManager(): void;
    private getEvent;
    fireClick(rowId: number, col: CanvasTableColumnConf): void;
    fireClickHeader(col: CanvasTableColumnConf): void;
    addEvent(eventName: "clickHeader", event: EventManagerClickHeader): void;
    addEvent(eventName: "click", event: EventManagerClick): void;
    removeEvent(eventName: "clickHeader", event: EventManagerClickHeader): void;
    removeEvent(eventName: "click", event: EventManagerClick): void;
}
